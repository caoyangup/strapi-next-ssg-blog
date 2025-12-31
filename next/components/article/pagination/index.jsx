import {
    Pagination as PaginationComponent,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * 响应式分页组件
 * @param {object} props
 * @param {number} props.currentPage - 当前页码
 * @param {number} props.totalPages - 总页数
 * @param {(page: number) => string} props.buildLink - 构建页码链接的函数
 */
export function Pagination({ currentPage, totalPages, buildLink }) {

    const renderPaginationItems = () => {
        const items = [];

        // 为不同断点（屏幕尺寸）定义显示的页码数量
        // 我们将以最大数量为基础来渲染所有可能的页码，然后通过CSS类来控制显示
        const lgSurroundingPageCount = 3; // lg 及以上屏幕: 当前页前后各显示3个页码
        const mdSurroundingPageCount = 2; // md 屏幕: 当前页前后各显示2个页码
        const smSurroundingPageCount = 1; // sm 及以下屏幕: 当前页前后各显示1个页码

        // --- 上一页按钮 ---
        items.push(
            <PaginationItem key="prev">
                <PaginationPrevious href={buildLink(currentPage - 1)} disabled={currentPage === 1} className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""} />
            </PaginationItem>
        );

        // --- 首页链接与起始省略号 ---
        // 判断逻辑基于最宽的屏幕(lg)，因为所有元素都已渲染，只是部分被隐藏
        if (currentPage > lgSurroundingPageCount + 1) {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink href={buildLink(1)}>1</PaginationLink>
                </PaginationItem>
            );
            if (currentPage > lgSurroundingPageCount + 2) {
                items.push(<PaginationEllipsis key="start-ellipsis" />);
            }
        }

        // --- 中间页码 ---
        // 循环遍历最大范围的页码
        for (let i = Math.max(1, currentPage - lgSurroundingPageCount); i <= Math.min(totalPages, currentPage + lgSurroundingPageCount); i++) {
            const distance = Math.abs(i - currentPage);
            let visibilityClass = "";

            // 根据页码与当前页的距离，添加响应式类名
            // `isActive` 的页码总是可见
            if (i !== currentPage) {
                if (distance > smSurroundingPageCount && distance <= mdSurroundingPageCount) {
                    // 距离大于1，小于等于2的页码：在 md 及以上屏幕可见
                    visibilityClass = "hidden md:flex";
                } else if (distance > mdSurroundingPageCount) {
                    // 距离大于2的页码：仅在 lg 及以上屏幕可见
                    visibilityClass = "hidden lg:flex";
                }
                // 距离为1的页码默认在所有尺寸下都可见，无需额外添加类
            }

            items.push(
                <PaginationItem key={i} className={visibilityClass}>
                    <PaginationLink href={buildLink(i)} isActive={i === currentPage}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // --- 末页链接与结束省略号 ---
        // 判断逻辑同样基于最宽的屏幕(lg)
        if (currentPage < totalPages - lgSurroundingPageCount) {
            if (currentPage < totalPages - lgSurroundingPageCount - 1) {
                items.push(<PaginationEllipsis key="end-ellipsis" />);
            }
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink href={buildLink(totalPages)}>{totalPages}</PaginationLink>
                </PaginationItem>
            );
        }

        // --- 下一页按钮 ---
        items.push(
            <PaginationItem key="next">
                <PaginationNext href={buildLink(currentPage + 1)} disabled={currentPage === totalPages} className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""} />
            </PaginationItem>
        );

        return items;
    };

    return (
        <PaginationComponent>
            <PaginationContent>
                {renderPaginationItems()}
            </PaginationContent>
        </PaginationComponent>
    );
}