import apiClient, { config, generateArticlePageStaticParams } from "@/lib/strapi/client";
import Page from "../../page";

export async function generateStaticParams() {
    return await generateArticlePageStaticParams();
}

export default Page;