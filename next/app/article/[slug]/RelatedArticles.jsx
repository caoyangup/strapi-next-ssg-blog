// import apiClient, { config, generateArticleSlugStaticParams } from "@/lib/strapi/client";
import { ListItem } from "@/components/article/ListItem";
// import qs from 'qs';


export default async function RelatedArticles({ articles = [], className = "mt-16 divide-y border-t", ...props }) {

    return (
        <ul role="list" className={className} {...props}>
            {articles
                .map((article) => (
                    <ListItem data={article} key={article.documentId} />
                ))}
        </ul>
    );
}