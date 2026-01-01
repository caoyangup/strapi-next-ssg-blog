import * as React from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"


import Image from "next/image";
import { strapiImage } from "@/lib/strapi/strapiImage";

import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react" //右箭头

function Card({
    className,
    data,
    // ...props
}) {
    // console.log(data)
    return (
        //bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm
        <div className={cn("group flex flex-col gap-3", className)} data-slot="card">
            <AspectRatio ratio={16 / 9}>
                {
                    data.cardImage ? <Image src={strapiImage(data.cardImage.url)} alt="Image" className="rounded-sm object-cover border border-border" width={data.cardImage.width || 1000} height={data.cardImage.height || 1000} /> : null
                }
            </AspectRatio>
            <span className="text-foreground text-sm flex items-center">
                {data.publishedAt && new Date(data.publishedAt).toLocaleDateString()}
                {/* 群组移入显示淡入淡出 */}
                <ArrowRight className="ml-auto inline-block opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 mr-2 text-accent-foreground" size={16} />
            </span>
            <h3 className="text-accent-foreground scroll-m-20 text-2xl font-medium tracking-tight">{data.title}</h3>
            <span className="text-foreground text-sm line-clamp-2">{data.desc}</span>
        </div>
    );
}


export {
    Card,
    //   CardHeader,
    //   CardFooter,
    //   CardTitle,
    //   CardAction,
    //   CardDescription,
    //   CardContent,
}
