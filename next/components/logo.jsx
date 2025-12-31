// "use client";
// import React from "react";
// import { useTheme } from "next-themes"
import Link from 'next/link'
import { BlurImage } from "./blur-image";
import { strapiImage } from "@/lib/strapi/strapiImage";

export const Logo = ({ logoText, logo, logoDark }) => {
  // const { theme } = useTheme();

  // 如果没有logo，直接返回null
  if (!logo) return null;

  // 根据主题选择正确的logo
  // const currentLogo = theme === 'light' ? logoDark : logo;

  return (
    <Link
      href="/"
      className="flex items-center gap-2"
    >
      
        <div className="dark:inline-block hidden ">
          <BlurImage
            src={strapiImage(logo?.url)}
            alt={logo?.alternativeText || "Logo"}
            width={40}
            height={40}
            className="h-7 w-auto"//不变形
          />
        </div>

        {/* 渲染浅色模式的 Logo，在深色模式下隐藏 */}
        <div className="dark:hidden inline-block">
          <BlurImage
            src={strapiImage(logoDark?.url)}
            alt={logoDark?.alternativeText || "Logo"}
            width={40}
            height={40}
            className="h-7 w-auto"
          />
        </div>

        {logoText && <span className="text-accent-foreground text-sm mr-auto">{logoText}</span>}
   
    </Link>
  );
};

 