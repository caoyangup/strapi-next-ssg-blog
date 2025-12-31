'use client'
import { motion, useCycle, AnimatePresence } from "motion/react"
import dynamic from 'next/dynamic'
import { Separator } from "@/components/ui/separator"

import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import Link from 'next/link'




// import ThemeToggle from "@/components/theme-toggle"
// 消除水和错误，这是最关键的一步
const ThemeToggle = dynamic(
  () => import('@/components/theme-toggle'), // 组件路径
  {
    ssr: false, // 明确告诉 Next.js：不要在服务器端渲染这个组件
    // loading: () => (<></>),
  }
)


export function Footer({ data, locale }) {
  const { logo, logoDark, nav, description, copyright } = data
  // const nav = nav.length >= 5 ? nav : [
  //   ...Array.from({ length: 5 - nav.length }, () => ({})),
  //   ...nav
  // ];
  return (
    <footer className='border-t mb-16 space-y-4'>
      <div className='wrapper'>
        <div className='py-16 grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-16 gap-y-16 text-wrap'>
          <div className='col-span-full lg:col-span-2 '>
            <Logo logo={logo} logoDark={logoDark} />
            <p className='text-sm mt-4'>{description}</p>
          </div>
          {/* 动态空白占位符 */}
          {nav.length < 4 && (
            <div className={cn(
              'hidden lg:block',
              nav.length === 1 ? 'col-span-4' :
                nav.length === 2 ? 'col-span-2' :
                  nav.length === 3 ? 'col-span-1' : ''
            )}></div>
          )}
          {nav.map((item, index) => (
            <div key={index} className='justify-self-start'>
              <h3 className='text-sm text-accent-foreground mb-6'>{item.text}</h3>
              <ul className='flex flex-col gap-2'>
                {item?.subItems?.map((subItem) => (
                  <li key={subItem.id}>
                    {subItem.href ? <Link href={subItem.href} className='hover:text-accent-foreground text-wrap wrap-anywhere'>{subItem.text}</Link> : subItem.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* <hr className='wrapper py-2 -mx-5' /> */}
        <Separator className={'my-4'} />
        <p className='text-center text-sm'>{copyright}</p>
      </div>

    </footer>
  )
}
