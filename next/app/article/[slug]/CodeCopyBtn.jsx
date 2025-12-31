'use client'

// 引入图标、组件和依赖
import { Copy, Check } from "lucide-react"
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import ReactCopyToClipboard from "@/components/react-copy-to-clipboard"; // 引入自定义复制组件

export default function CodeCopyBtn({ children }) {
  // 追踪复制状态
  const [copied, setCopied] = useState(false)

  // 处理复制结果的回调函数
  const handleCopyResult = (isCopied, text) => {
    if (isCopied) {
      setCopied(true)
      // 2秒后恢复默认状态
      setTimeout(() => setCopied(false), 2000)
    } else {
      console.error('复制失败！无法将内容复制到剪贴板')
    }
  }

  // 动画变体配置
  const variants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  }

  // 要复制的文本内容（确保是字符串类型）
  const textToCopy = String(children)

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="absolute top-2 right-2"
    >
      {/* 使用 ReactCopyToClipboard 包裹按钮，传递文本和回调 */}
      <ReactCopyToClipboard
        text={textToCopy}
        onCopy={handleCopyResult}
      >
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer size-8"
        >
          <AnimatePresence initial={false} mode="wait">
            {copied ? (
              // 复制成功状态
              <motion.span
                key="copied"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="flex items-center justify-center"
              >
                <Check />
              </motion.span>
            ) : (
              // 默认状态
              <motion.span
                key="copy"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="flex items-center justify-center"
              >
                <Copy />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </ReactCopyToClipboard>
    </motion.div>
  )
}