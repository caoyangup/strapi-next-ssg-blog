"use client"
// components/GiscusComments.jsx
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Script from 'next/script'
import { cn } from "@/lib/utils";
import Giscus from '@giscus/react';



export default function GiscusComments({ className, ...props }) {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // 确保在客户端渲染后再显示，避免服务端和客户端主题不一致
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // 当主题变化时，重新加载 Giscus 以应用新主题
        const iframe = document.querySelector('iframe.giscus-frame');
        if (iframe) {
            const giscus = iframe.contentWindow;
            giscus.postMessage(
                {
                    giscus: {
                        setConfig: {
                            theme: getGiscusTheme(resolvedTheme),
                        },
                    },
                },
                'https://giscus.app'
            );
        }
    }, [resolvedTheme]);

    const getGiscusTheme = (currentTheme) => {
        // const dark = 'dark_dimmed';
        // const light = 'light_tritanopia';
        // const dark = 'https://cdn.jsdelivr.net/gh/ok1054689/blog-giscus@main/dark2.css';
        // const light = 'https://cdn.jsdelivr.net/gh/ok1054689/blog-giscus@main/light.css';
        const dark = process.env.NEXT_PUBLIC_URL + '/giscus/dark.css';
        const light = process.env.NEXT_PUBLIC_URL + '/giscus/light.css';

        if (!mounted) return dark; // 默认主题

        switch (currentTheme) {
            case 'dark':
                return dark;
            case 'light':
                return light;
            default:
                return dark;
        }
    };

    if (!mounted) {
        return <div className="giscus">Loading comments...</div>;
    }
    return <div className={cn("giscus", className)} {...props}>

        <Giscus
            id="comments"
            repo="caoyangup/giscus"
            repoId="R_kgDOQDlcrw"
            category="comment"
            categoryId="DIC_kwDOQDlcr84CwtvL"
            mapping="pathname"
            // term="Welcome to @giscus/react component!"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={getGiscusTheme(resolvedTheme)}
            // theme="https://xui-us.877855.xyz/dark.css"
            // theme="https://xui-us.877855.xyz/light.css"
            // theme="https://cdn.jsdelivr.net/gh/ok1054689/blog-giscus@main/dark2.css" 
            lang="zh-CN"
            loading="lazy"
        />
    </div>

}