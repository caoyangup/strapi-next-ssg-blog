// import CountUp from '@/components/CountUp'
import Link from "next/link";
import font from "@/lib/font";

export default async function Tags({
    tags,
    sortFn = null, // 默认不排序，保持原顺序
    showCount = true,
    className = "mt-8 flex justify-center flex-wrap gap-4",
    ...props
}) {
    if (tags && tags.length > 0) {
        // 如果有排序函数就应用排序，否则保持原顺序
        const processedTags = sortFn ? [...tags].sort(sortFn) : tags;
        return (
            <ul role="list" className={className} {...props}>
                {processedTags.map((tag) => (
                    // <ListItem data={article} key={article.documentId} isTop /> 
                    <li key={tag.id} className="isolate group/li">
                        <Link href={`/tag/${tag?.slug}`} className=''>
                            <span className="text-primary group-hover/li:text-accent-foreground transition-colors duration-200">{tag.name}</span>
                            {showCount === true && tag?.articles?.count && 
                                <>
                                    &nbsp;<span className={font.orbitron.className}>&#40;{tag.articles.count}&#41;</span>
                                </>}
                        </Link>
                    </li>
                ))}
            </ul>
        )
    }
    return null;
}