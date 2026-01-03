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

    // 检查 Giscus 是否已配置
    const isGiscusEnabled = process.env.NEXT_PUBLIC_GISCUS_ENABLED === 'true' &&
        process.env.NEXT_PUBLIC_GISCUS_REPO &&
        process.env.NEXT_PUBLIC_GISCUS_REPO_ID;

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

    // 如果 Giscus 未启用或未配置，不渲染评论组件
    if (!isGiscusEnabled) {
        return null;
    }

    if (!mounted) {
        return <div className="giscus">Loading comments...</div>;
    }
    return <div className={cn("giscus", className)} {...props}>

        <Giscus
            id="comments"
            repo={process.env.NEXT_PUBLIC_GISCUS_REPO}
            repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID}
            category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'General'}
            categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID}
            mapping={process.env.NEXT_PUBLIC_GISCUS_MAPPING || 'pathname'}
            reactionsEnabled={process.env.NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED || '1'}
            emitMetadata="0"
            inputPosition={process.env.NEXT_PUBLIC_GISCUS_INPUT_POSITION || 'top'}
            theme={getGiscusTheme(resolvedTheme)}
            lang={process.env.NEXT_PUBLIC_GISCUS_LANG || 'zh-CN'}
            loading="lazy"
        />
    </div>

}