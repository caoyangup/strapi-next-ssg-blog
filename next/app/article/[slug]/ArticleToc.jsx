"use client"

import { useEffect, useState, useRef } from 'react';
import Slugger from 'github-slugger';

/**
 * ArticleToc 组件 - 用于生成并显示文章的目录导航
 * @param {object} props - 组件属性
 * @param {string} props.content - Markdown 格式的文章内容
 * @param {string[]} [props.allowedLevels=['h2', 'h3']] - 指定要显示的标题层级，例如 ['h2', 'h3', 'h4']
 */
const ArticleToc = ({
    content = "",
    allowedLevels = ['h2', 'h3'],
    Label = <h3 key={"ArticleToc"} className="text-sm font-medium mb-2 text-foreground">
        文章目录
    </h3>,
    headingsFirst = [], // 额外的标题数据，格式同 extractHeadings 提取的结果
    headingsLast = [],  // 额外的标题数据，格式同 extractHeadings 提取的结果
    multipleActive = true, // 是否允许多个标题同时高亮
    ...props
}) => {
    if (!content && headingsFirst.length === 0 && headingsLast.length === 0) {
        return null;
    }
    // 使用 useState 来存储提取出的标题
    const [headings, setHeadings] = useState([]);
    // 存储当前活跃的标题 ID 
    const [activeIds, setActiveIds] = useState([]);
    // 使用 useRef 来存储当前可见的标题ID，这样在 observer 的回调中可以访问到最新状态，而不会有闭包问题
    const visibleHeadings = useRef(new Set());

    // 【关键修复】
    // 使用 JSON.stringify 将数组依赖项转换为稳定的字符串。
    // 这样，即使父组件在每次渲染时都创建新数组，只要数组内容不变，
    // 这个字符串就不会变，从而避免了 useEffect 的不必要执行。
    const allowedLevelsString = JSON.stringify(allowedLevels);
    // ✅ 新增：将 headingsFirst、headingsLast 也序列化
    const headingsFirstString = JSON.stringify(headingsFirst);
    const headingsLastString = JSON.stringify(headingsLast);

    useEffect(() => {
        let mounted = true; // ✅ 防止异步状态更新引发重复渲染
        const extractHeadings = () => {
            const slugger = new Slugger();
            const headingRegex = /^(#{1,6})\s+(.*)/gm;
            const matches = Array.from(content?.matchAll(headingRegex) || []);

            const currentAllowedLevels = JSON.parse(allowedLevelsString);
            const currentHeadingsFirst = JSON.parse(headingsFirstString);
            const currentHeadingsLast = JSON.parse(headingsLastString);

            const extracted = matches
                .map(match => {
                    const level = match[1].length;
                    const text = match[2].trim();
                    const id = slugger.slug(text);
                    return { id, text, level };
                })
                .filter(heading => currentAllowedLevels.includes(`h${heading.level}`));

            const merged = [...currentHeadingsFirst, ...extracted, ...currentHeadingsLast];

            // ✅ 只有内容真正变化时才 setState，避免死循环
            setHeadings(prev => {
                const prevStr = JSON.stringify(prev);
                const nextStr = JSON.stringify(merged);
                return prevStr === nextStr ? prev : merged;
            });
        };

        extractHeadings();
        return () => { mounted = false; };
    }, [content, allowedLevelsString, headingsFirstString, headingsLastString]);

    useEffect(() => {
        const allHeadings = headings;

        if (allHeadings.length === 0) return;

        // 创建辅助观察元素容器
        const observerContainer = document.createElement('div');
        observerContainer.style.cssText = 'position: absolute; top: 0; left: 0; width: 1px; pointer-events: none; z-index: -1;';
        document.body.appendChild(observerContainer);

        const observerElements = [];

        // 为每个标题创建观察辅助元素
        allHeadings.forEach((heading, index) => {
            const targetElement = document.getElementById(heading.id);
            if (!targetElement) return;

            const observerEl = document.createElement('div');
            observerEl.dataset.headingId = heading.id;
            observerEl.style.cssText = 'position: absolute; width: 1px; height: 1px;';

            observerContainer.appendChild(observerEl);
            observerElements.push({ element: observerEl, headingId: heading.id, index });
        });

        // 计算并更新观察元素位置
        const updateObserverPositions = () => {
            allHeadings.forEach((heading, index) => {
                const targetElement = document.getElementById(heading.id);
                const nextElement = allHeadings[index + 1] ? document.getElementById(allHeadings[index + 1].id) : null;

                if (!targetElement) return;

                const observerEl = observerElements[index]?.element;
                if (!observerEl) return;

                const startPos = targetElement.offsetTop;
                const endPos = nextElement ? nextElement.offsetTop : document.body.scrollHeight;
                const height = endPos - startPos;

                // 设置观察元素的位置和高度，覆盖从当前标题到下一个标题的区域
                observerEl.style.top = `${startPos}px`;
                observerEl.style.height = `${height}px`;
            });
        };

        // 初始化位置
        updateObserverPositions();

        // 创建 Intersection Observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const headingId = entry.target.dataset.headingId;

                    if (entry.isIntersecting) {
                        setActiveIds(prev => {
                            // 多个 Active ID 模式
                            if (multipleActive) {
                                if (prev.includes(headingId)) {
                                    return prev;
                                }
                                return [...prev, headingId];
                            }
                            // 单个 Active ID 模式
                            else {
                                if (prev.length === 1 && prev[0] === headingId) {
                                    return prev;
                                }
                                return [headingId];
                            }
                        });
                    } else {
                        // 当元素离开视口时，在多个模式下移除该 ID
                        if (multipleActive) {
                            setActiveIds(prev => prev.filter(id => id !== headingId));
                        }
                    }
                });
            },
            {
                // rootMargin 负值用于偏移 header 高度
                rootMargin: '-100px 0px -0% 0px',
                threshold: 0
            }
        );

        // 观察所有辅助元素
        observerElements.forEach(({ element }) => {
            observer.observe(element);
        });

        // 监听 resize 重新计算位置
        const resizeObserver = new ResizeObserver(() => {
            updateObserverPositions();
        });
        resizeObserver.observe(document.body);

        return () => {
            observer.disconnect();
            resizeObserver.disconnect();
            observerContainer.remove();
        };
    }, [headings]);


    /**
     * 处理导航链接点击事件，实现带偏移量的平滑滚动
     * @param {React.MouseEvent<HTMLAnchorElement>} e - 点击事件对象
     * @param {string} id - 目标标题的 ID
     */
    const handleLinkClick = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // 为固定的 header 留出空间，这里的 80px 是偏移量
            const scrollOffset = 80;
            // 计算元素的绝对顶部位置
            const elementPosition = element.getBoundingClientRect().top;
            // 计算考虑了当前滚动位置和偏移量后的最终滚动位置
            const offsetPosition = elementPosition + window.pageYOffset - scrollOffset;

            // 使用 window.scrollTo 实现带偏移量的平滑滚动
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // 手动更新 URL 的 hash
            window.history.pushState(null, '', `#${id}`);
        }
    };

    // 如果没有提取到任何标题，则不渲染任何内容
    if (headings.length === 0) {
        return null;
    }

    // 根据标题级别获取连接线的 Tailwind CSS 宽度类名 (已更新)
    const getLineClassName = (level) => {
        switch (level) {
            case 2:
                return 'before:w-4'; // 基础宽度 (pl-4 对应的 16px)
            case 3:
                return 'before:w-8'; // 基础宽度 (16px) + 缩进 (16px) = 32px
            case 4:
                return 'before:w-12'; // 基础宽度 (16px) + 缩进 (32px) = 48px
            default:
                return 'before:w-4';
        }
    };

    // 根据标题级别获取对应的 CSS 类名，用于缩进
    const getLevelClassName = (level) => {
        switch (level) {
            case 2:
                return 'pl-0'; // h2 不缩进
            case 3:
                return 'pl-4'; // h3 缩进
            case 4:
                return 'pl-8'; // h4 进一步缩进
            default:
                return 'pl-0';
        }
    };

    const renderHeadingItem = (heading) => (
        <li key={heading.id} className="relative group">
            <div
                className={`absolute w-1.5 h-1.5 rounded-full top-1/2 -translate-y-1/2 left-[-19.5px] transition-colors duration-200 ${activeIds.includes(heading.id)
                    ? 'bg-primary'
                    : 'bg-muted-foreground'
                    } group-hover:bg-accent-foreground`}
            ></div>
            <a
                href={`#${heading.id}`}
                onClick={(e) => handleLinkClick(e, heading.id)}
                className={`relative block py-1 text-sm rounded-sm transition-colors duration-200 
                    before:absolute before:top-1/2 before:-translate-y-1/2 before:left-[-16px] before:h-px before:bg-border before:-z-10
                    ${getLineClassName(heading.level)}
                    ${getLevelClassName(heading.level)} 
                    ${activeIds.includes(heading.id)
                        ? 'text-primary font-medium'
                        : 'text-foreground '
                    } group-hover:text-accent-foreground`}
            >
                <span className='line-clamp-1'>{heading.text}</span>
            </a>
        </li>
    );

    return (
        <nav {...props}>
            {Label}
            <ul className="border-l border-border pl-4">
                {headings.map(renderHeadingItem)}
            </ul>
        </nav>
    );
};

export default ArticleToc;
