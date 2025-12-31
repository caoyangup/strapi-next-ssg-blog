import { visit } from 'unist-util-visit';

/**
 * 自定义 remark 插件：在每个 h2 标题前添加分隔符
 * 如果 h2 的上一个兄弟节点不是分隔线（thematicBreak），则插入一个分隔线
 */
export default function remarkAddDividerBeforeH2() {
    return (tree) => {
        const nodesToInsert = [];

        // 遍历所有节点，找到需要在其前面插入分隔线的 h2
        visit(tree, 'heading', (node, index, parent) => {
            // 只处理 h2 标题
            if (node.depth !== 2) return;

            // 检查是否有父节点和有效索引
            if (!parent || typeof index !== 'number') return;

            // 如果是第一个节点，不需要添加分隔符
            if (index === 0) return;

            // 获取上一个兄弟节点
            const previousNode = parent.children[index - 1];

            // 如果上一个节点不是分隔线（thematicBreak），则记录需要插入的位置
            if (previousNode && previousNode.type !== 'thematicBreak') {
                nodesToInsert.push({ parent, index });
            }
        });

        // 从后往前插入，避免索引偏移问题
        for (let i = nodesToInsert.length - 1; i >= 0; i--) {
            const { parent, index } = nodesToInsert[i];
            // 创建一个分隔线节点
            const thematicBreak = {
                type: 'thematicBreak',
            };
            // 在 h2 之前插入分隔线
            parent.children.splice(index, 0, thematicBreak);
        }

        return tree;
    };
}
