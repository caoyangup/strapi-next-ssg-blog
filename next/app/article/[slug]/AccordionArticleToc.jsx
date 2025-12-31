"use client"

import { useEffect, useState } from "react"
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import ArticleToc from "./ArticleToc"


export default function AccordionArticleToc({
    content,
    Label,
    articleTocProps = { allowedLevels: ["h2", "h3"] },
    ...props
}) {
    const [open, setOpen] = useState(undefined)
    useEffect(() => {
        const media = window.matchMedia("(min-width: 768px)") // md 断点
        const handler = () => {
            setOpen(media.matches ? "toc" : undefined)
        }
        handler()
        media.addEventListener("change", handler)
        return () => media.removeEventListener("change", handler)
    }, [])

    return (
        <Accordion type="single" collapsible {...props} value={open} onValueChange={setOpen} >
            <AccordionItem value="toc">
                <AccordionTrigger className={"py-0 cursor-pointer hover:no-underline"}>{Label}</AccordionTrigger>
                <AccordionContent>
                    <ArticleToc
                        className="pl-1"
                        Label={null}
                        {...articleTocProps}
                        content={content}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
