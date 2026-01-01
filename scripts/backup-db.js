#!/usr/bin/env node

/**
 * 数据库文件自动备份脚本
 * 
 * 功能：
 * - 使用轮询方式检查文件变化（不会锁定文件）
 * - 文件修改时使用系统 cp 命令备份（避免 Node.js 文件锁）
 * - 每天一个备份文件（按日期命名）
 * - 自动清理过期备份
 * 
 * 用法：
 *   node scripts/backup-db.js
 * 
 * 环境变量配置：
 *   BACKUP_SOURCE_FILE    - 要监控的源文件路径
 *   BACKUP_TARGET_DIR     - 备份目标目录
 *   BACKUP_RETENTION_DAYS - 保留天数（默认 2）
 *   BACKUP_POLL_INTERVAL  - 轮询间隔，毫秒（默认 30000，即30秒）
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// ============ 配置 ============
const config = {
    // 要监控的源文件（数据库文件）
    sourceFile: process.env.BACKUP_SOURCE_FILE || './strapi/database/data.db',

    // 备份目标目录
    targetDir: process.env.BACKUP_TARGET_DIR || '/Users/yang/Library/Mobile Documents/com~apple~CloudDocs/Blog/database',

    // 保留天数
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '2', 10),

    // 轮询间隔（毫秒）- 检查文件变化的频率
    pollInterval: parseInt(process.env.BACKUP_POLL_INTERVAL || '30000', 10),
};

// ============ 工具函数 ============

/**
 * 获取今天的日期字符串 (YYYY-MM-DD)
 */
function getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 获取当前时间字符串 (HH:MM:SS)
 */
function getTimeString() {
    const now = new Date();
    return now.toLocaleTimeString('zh-CN', { hour12: false });
}

/**
 * 日志输出
 */
function log(message) {
    console.log(`[${getTimeString()}] [Backup] ${message}`);
}

/**
 * 确保目录存在
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        log(`创建目录: ${dirPath}`);
    }
}

/**
 * 获取备份文件名
 * 格式: data-YYYY-MM-DD.db
 */
function getBackupFileName(sourceFile) {
    const ext = path.extname(sourceFile);
    const baseName = path.basename(sourceFile, ext);
    const dateStr = getTodayDateString();
    return `${baseName}-${dateStr}${ext}`;
}

/**
 * 使用系统 cp 命令执行备份（避免文件锁定）
 */
function performBackup() {
    return new Promise((resolve) => {
        const sourcePath = path.resolve(config.sourceFile);

        // 检查源文件是否存在
        if (!fs.existsSync(sourcePath)) {
            log(`⚠️  源文件不存在: ${sourcePath}`);
            resolve(false);
            return;
        }

        // 确保目标目录存在
        ensureDir(config.targetDir);

        // 生成备份文件路径
        const backupFileName = getBackupFileName(config.sourceFile);
        const backupPath = path.join(config.targetDir, backupFileName);

        // 使用系统 cp 命令复制文件，不会锁定源文件
        const cp = spawn('cp', ['-f', sourcePath, backupPath]);

        cp.on('close', (code) => {
            if (code === 0) {
                try {
                    const stats = fs.statSync(backupPath);
                    const sizeKB = (stats.size / 1024).toFixed(2);
                    log(`✅ 备份成功: ${backupFileName} (${sizeKB} KB)`);
                } catch {
                    log(`✅ 备份完成: ${backupFileName}`);
                }
                resolve(true);
            } else {
                log(`❌ 备份失败，cp 返回码: ${code}`);
                resolve(false);
            }
        });

        cp.on('error', (error) => {
            log(`❌ 备份失败: ${error.message}`);
            resolve(false);
        });
    });
}

/**
 * 清理过期备份
 */
function cleanupOldBackups() {
    if (!fs.existsSync(config.targetDir)) {
        return;
    }

    const files = fs.readdirSync(config.targetDir);
    const now = Date.now();
    const retentionMs = config.retentionDays * 24 * 60 * 60 * 1000;

    // 获取源文件的基础名称用于匹配
    const ext = path.extname(config.sourceFile);
    const baseName = path.basename(config.sourceFile, ext);
    const pattern = new RegExp(`^${baseName}-(\\d{4}-\\d{2}-\\d{2})${ext.replace('.', '\\.')}$`);

    let deletedCount = 0;

    for (const file of files) {
        const match = file.match(pattern);
        if (match) {
            const dateStr = match[1];
            const fileDate = new Date(dateStr).getTime();

            if (now - fileDate > retentionMs) {
                const filePath = path.join(config.targetDir, file);
                try {
                    fs.unlinkSync(filePath);
                    log(`🗑️  删除过期备份: ${file}`);
                    deletedCount++;
                } catch (error) {
                    log(`⚠️  无法删除文件 ${file}: ${error.message}`);
                }
            }
        }
    }

    if (deletedCount > 0) {
        log(`清理完成，删除了 ${deletedCount} 个过期备份`);
    }
}

/**
 * 获取文件的修改时间（不锁定文件）
 */
function getFileMtime(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.mtimeMs;
    } catch {
        return null;
    }
}

// ============ 主程序 ============

async function main() {
    const sourcePath = path.resolve(config.sourceFile);

    console.log('');
    console.log('╔═══════════════════════════════════════════════════╗');
    console.log('║         📦 数据库自动备份服务启动                 ║');
    console.log('╠═══════════════════════════════════════════════════╣');
    console.log(`║ 监控文件: ${config.sourceFile}`);
    console.log(`║ 备份目录: ${config.targetDir}`);
    console.log(`║ 保留天数: ${config.retentionDays} 天`);
    console.log(`║ 轮询间隔: ${config.pollInterval / 1000} 秒`);
    console.log('╚═══════════════════════════════════════════════════╝');
    console.log('');

    // 检查源文件是否存在
    if (!fs.existsSync(sourcePath)) {
        log(`⚠️  源文件暂不存在，等待文件创建: ${sourcePath}`);
    }

    // 启动时执行一次备份和清理
    if (fs.existsSync(sourcePath)) {
        await performBackup();
        cleanupOldBackups();
    }

    // 记录上次的修改时间
    let lastMtime = getFileMtime(sourcePath);
    let lastBackupDate = getTodayDateString();

    log(`轮询监控已启动，每 ${config.pollInterval / 1000} 秒检查一次文件变化...`);

    // 使用轮询方式检查文件变化（完全不会锁定文件）
    const pollTimer = setInterval(async () => {
        const currentMtime = getFileMtime(sourcePath);
        const currentDate = getTodayDateString();

        // 如果源文件不存在，跳过
        if (currentMtime === null) {
            return;
        }

        // 检查是否需要备份：
        // 1. 文件修改时间变化了
        // 2. 日期变化了（新的一天，需要创建新备份）
        const fileChanged = lastMtime !== null && currentMtime > lastMtime;
        const dateChanged = currentDate !== lastBackupDate;

        if (fileChanged || dateChanged) {
            if (fileChanged) {
                log(`检测到文件修改`);
            }
            if (dateChanged) {
                log(`新的一天，创建当日备份`);
            }

            await performBackup();
            cleanupOldBackups();

            lastMtime = currentMtime;
            lastBackupDate = currentDate;
        }
    }, config.pollInterval);

    // 优雅退出
    process.on('SIGINT', () => {
        console.log('');
        log('收到退出信号，正在关闭...');
        clearInterval(pollTimer);
        log('备份服务已停止');
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        clearInterval(pollTimer);
        process.exit(0);
    });
}

main();
