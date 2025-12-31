'use client'

import { Copy, Check } from "lucide-react"
import { useState, useEffect, useMemo } from 'react' // 新增 useMemo
import { motion, AnimatePresence } from "motion/react"
import ReactCopyToClipboard from "@/components/react-copy-to-clipboard";

export default function CopyLink({ copyText, ...props }) {
  const [copied, setCopied] = useState(false)
  const [textToCopy, setTextToCopy] = useState(String(copyText)) // 存储最终要复制的文本

  // 关键：在浏览器端挂载后，处理相对路径拼接（依赖 window）
  useEffect(() => {
    let processedText = String(copyText)
    // 此时 window 已存在，可安全访问
    if (processedText.startsWith('/')) {
      processedText = window.location.origin + processedText
    }
    setTextToCopy(processedText)
  }, [copyText]) // 仅当 copyText 变化时重新计算

  // 处理复制回调
  const handleCopy = (isCopied) => {
    if (isCopied) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } else {
      console.error('无法复制文本: 复制操作失败')
    }
  }

  return (
    <ReactCopyToClipboard 
      text={textToCopy} // 使用处理后的文本
      onCopy={handleCopy}
    >
      <button
        type="button"
        className="cursor-pointer group relative overflow-hidden flex items-center gap-1"
        {...props}
      >
        <div className="relative h-5 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {!copied ? (
              <motion.div
                key="default"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1 text-primary"
              >
                <Copy size={16} />
                <span>复制链接</span>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1 text-accent-foreground"
              >
                <Check size={16} />
                <span>复制成功</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </ReactCopyToClipboard>
  )
}