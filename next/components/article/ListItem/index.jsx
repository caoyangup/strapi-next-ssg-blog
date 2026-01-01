import * as React from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Link from "next/link";
import Image from "next/image";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { cn } from "@/lib/utils"
import { ArrowRight, ArrowUpWideNarrow } from "lucide-react" //右箭头 
import { Badge } from "@/components/ui/badge"
import font from "@/lib/font";
import Tags from "@/components/article/tags";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

function ListItem({
    className,
    data,
    isTop = false,
    // ...props
}) {
    // console.log(data)
    return (
        //bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm
        <li className={cn("group grid grid-cols-12 md:flex-row py-6 relative gap-4 md:gap-8", className)} data-slot="card">
            <Link href={`/article/${data.slug}`} className="absolute inset-0" aria-label={`阅读文章：${data.title}`}><span className="sr-only">{`阅读文章：${data.title}`}</span></Link>
            <div className="col-span-full md:col-span-3 flex text-foreground">
                <span className={cn("inline-block text-xs tracking-widest", font.orbitron.className)}>
                    {data.publishedAt && new Date(data.publishedAt).toLocaleDateString()}
                </span>
                <span className="ml-auto">
                    <ArrowRight className="text-primary ml-auto inline-block opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 mr-2" size={16} />
                    {isTop && <ArrowUpWideNarrow size={16} className="inline-block " />}
                </span>

            </div>

            <div className="col-span-full md:col-span-9 flex flex-col gap-3 ">
                <h3 className="text-accent-foreground scroll-m-20 text-2xl font-medium tracking-tight align-middle line-clamp-3 lg:line-clamp-1 md:-mt-2">
                    {data.title}
                </h3>
                {
                    data.tags && data.tags.length > 0 &&
                    <ScrollArea className={"w-full whitespace-nowrap"}>
                        <Tags tags={data.tags} className="mt-0 flex flex-nowrap gap-4" />
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                }
                <span className="leading-6 text-foreground text-sm line-clamp-3 lg:line-clamp-2">{data.desc}</span>

            </div>
        </li>
    );
}


export {
    ListItem,
}
