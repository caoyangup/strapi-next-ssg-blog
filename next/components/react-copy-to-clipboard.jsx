import React, { useRef, useCallback, forwardRef } from 'react';
import copy from 'copy-to-clipboard';


/**
 * 支持 React 19 的复制到剪贴板组件
 * 基于 copy-to-clipboard 库实现
 */
const ReactCopyToClipboard = forwardRef(({ text, onCopy, options, children }, ref) => {
    // 用于处理点击事件的回调函数
    const handleCopy = useCallback(() => {
        // 执行复制操作
        const copied = copy(text, options);

        // 如果提供了回调函数，执行它
        if (onCopy) {
            onCopy(copied, text);
        }
    }, [text, options, onCopy]);

    // 获取子元素并注入 onClick 事件
    const getChildren = () => {
        // 如果子元素是单个 React 元素，尝试添加 onClick 事件
        if (React.isValidElement(children)) {
            return React.cloneElement(children, {
                onClick: (e) => {
                    // 保留子元素原有的 onClick 事件（如果有）
                    if (children.props.onClick) {
                        children.props.onClick(e);
                    }
                    // 执行复制操作（如果事件未被阻止）
                    if (!e.defaultPrevented) {
                        handleCopy();
                    }
                },
            });
        }

        // 如果没有有效子元素，返回一个默认的按钮
        return (
            <button onClick={handleCopy}>
                复制文本
            </button>
        );
    };

    return (
        <div ref={ref} style={{ display: 'inline-block' }}>
            {getChildren()}
        </div>
    );
});

export default ReactCopyToClipboard;