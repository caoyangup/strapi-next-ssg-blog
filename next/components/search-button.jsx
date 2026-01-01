'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Search, Loader2 } from 'lucide-react';

export function SearchButton() {
    // 状态管理
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [pagefind, setPagefind] = useState(null);
    const router = useRouter();
    // 判断是否为开发环境
    const isDevelopment = process.env.NODE_ENV === 'development';

    // 初始化 Pagefind
    useEffect(() => {
        // 开发模式下，不加载 Pagefind
        if (isDevelopment) {
            console.log('Development mode: Pagefind is disabled.');
            return;
        }

        if (open && !pagefind) {
            const initPagefind = async () => {
                try {
                    // 动态导入 Pagefind，使用 webpackIgnore 避免打包问题
                    const pagefindModule = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js');
                    setPagefind(pagefindModule);
                } catch (error) {
                    console.error('加载 Pagefind 失败:', error);
                }
            };
            initPagefind();
        }
    }, [open, pagefind]);

    // 执行搜索
    const performSearch = useCallback(async (searchQuery) => {
        // 开发模式下，返回模拟数据或空数组
        if (isDevelopment) {

            // 你可以在这里返回一个空数组，或者一些模拟的搜索结果用于测试
            // console.log('Development mode: Search is disabled. Query was:', query);
            const testData = [
                // 示例模拟数据
                { url: '/dev-doc-1', meta: { title: '开发文档示例一' }, excerpt: 'A small snippet of the <mark>static</mark> content, with the search term(s) highlighted in &lt;mark&gt; elements' },
                { url: '/dev-doc-2', meta: { title: '开发文档示例二' }, excerpt: 'A snippet of the <mark>static</mark> content, scoped between this anchor and the next one' }
            ]
            setResults(testData);
            return testData;
        }

        // 空查询或没有 pagefind 实例时清空结果
        if (!pagefind || !searchQuery.trim()) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            const search = await pagefind.search(searchQuery);
            if (search && search.results) {
                // 并行加载所有结果的详细信息
                const resultsData = await Promise.all(
                    search.results.map((result) => result.data())
                );
                // console.log('搜索结果:', resultsData);
                setResults(resultsData);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error('搜索失败:', error);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [pagefind]);

    // 防抖搜索
    useEffect(() => {
        if (!open) return;

        const timeoutId = setTimeout(() => {
            performSearch(query);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, open, performSearch]);

    // 键盘快捷键
    useEffect(() => {
        const handleKeyDown = (event) => {
            // 排除在输入元素中触发
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                event.target.isContentEditable
            ) {
                return;
            }

            // Ctrl+K 或 Cmd+K 打开搜索
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                setOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 处理弹窗状态变化
    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            // 关闭时重置状态
            setQuery('');
            setResults([]);
            setIsSearching(false);
        }
    };

    // 处理结果点击
    const handleResultClick = useCallback((url) => {
        router.push(url);
        setOpen(false);
    }, []);

    return (
        <>
            {/* 搜索触发按钮 */}
            {/* <Button
                variant="outline"
                className="relative flex items-center gap-2 text-sm text-muted-foreground w-32 justify-start h-9"
                onClick={() => setOpen(true)}
            >
                <Search size={16} />
                <span>搜索文档...</span>
                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button> */}
            <Button
                variant="ghost"
                size="icon"
                className={"cursor-pointer text-accent-foreground"}
                onClick={() => setOpen(true)}
                aria-label="Search"
            ><Search /></Button>

            {/* 搜索弹窗 - 使用 CommandDialog 替代原生 Dialog */}
            <CommandDialog open={open} onOpenChange={handleOpenChange} commandProps={{ shouldFilter: false }}>

                {/* <div className=" "> 
                    <CommandInput
                        placeholder="搜索文档..."
                        value={query}
                        onValueChange={setQuery}
                        className=""
                    /> 
                    {isSearching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />}
                </div> */}
                <CommandInput
                    placeholder="搜索文档..."
                    value={query}
                    onValueChange={setQuery}
                    className=""
                />

                <CommandList className={"max-h-[70lvh]"}>
                    {/* 空状态提示 */}
                    <CommandEmpty>
                        {!query ? '请输入搜索关键词' : isSearching ? '搜索中...' : '未找到相关结果'}
                    </CommandEmpty>

                    {/* 搜索结果列表 */}
                    {results.length > 0 && (
                        <CommandGroup heading={`找到 ${results.length} 个结果`} className={"py-2"}>
                            {results.map((result, index) => (
                                <CommandItem
                                    key={result.url + index}
                                    // value={result.meta?.title || result.url}
                                    onSelect={() => handleResultClick(result.url)}
                                    className="flex flex-col items-start gap-1 p-4 aria-selected:bg-accent aria-selected:text-accent-foreground !cursor-pointer"
                                >
                                    <div className="font-medium text-accent-foreground line-clamp-1">
                                        {result.meta?.title || '无标题'}
                                    </div>
                                    <p
                                        className="text-sm text-foreground line-clamp-2"
                                        dangerouslySetInnerHTML={{
                                            __html: result.excerpt
                                                // 移除除 mark 之外的所有其他 HTML 标签
                                                .replace(/<(?!\/?mark\b)[^>]*>/gi, '')
                                                // 给 mark 标签添加 class
                                                .replace(/<mark\b([^>]*)>/gi, '<mark class="text-primary bg-transparent"$1>')
                                        }}
                                    />
                                    {/* <div className="text-xs text-muted-foreground truncate max-w-full">
                                        {result.url}
                                    </div> */}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog >
        </>
    );
}