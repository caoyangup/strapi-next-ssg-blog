"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function BlogRedirect() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Redirect from /blog/* to /article/*
        const newPath = pathname.replace(/^\/blog/, "/article");
        router.replace(newPath);
    }, [pathname, router]);

    return (
        <div className="wrapper pt-[61px] pb-16 flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-muted-foreground">正在跳转...</p>
        </div>
    );
}
