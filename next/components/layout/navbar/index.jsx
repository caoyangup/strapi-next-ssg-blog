'use client'
import { motion, useCycle, AnimatePresence } from "motion/react"
import dynamic from 'next/dynamic'

import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { MenuToggle } from './MenuToggle'
import { SearchButton } from "@/components/search-button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


// import ThemeToggle from "@/components/theme-toggle"
// 消除水和错误，这是最关键的一步
const ThemeToggle = dynamic(
  () => import('@/components/theme-toggle'), // 组件路径
  {
    ssr: false, // 明确告诉 Next.js：不要在服务器端渲染这个组件
    // loading: () => (<></>),
  }
)


export function Navbar({ data, locale }) {
  const [isOpen, toggleOpen] = useCycle(false, true)
  return (
    <Dialog className="" open={isOpen} onOpenChange={toggleOpen}>
      <div className='relative'>
        <header className={cn(
          'fixed inset-x-0 z-50 border-b-1 h-[var(--header-height)] flex items-center transition',
          isOpen && 'dark:shadow-md/70 shadow-lg/5',
        )}>
          <div className='absolute inset-0 backdrop-blur bg-white/80 dark:bg-black/80'></div>
          <NavigationMenu viewport={false} className="wrapper block" >
            <div className="flex items-center">
              <div className="mr-auto"><Logo image={data.logo} logo={data.logo} logoDark={data.logoDark} logoText={data.logoText} /></div>

              <NavigationMenuList className={""}>

                {
                  data.nav.map((item, index) => (
                    <NavigationMenuItem key={index} className={'hidden md:flex justify-self-center'}>
                      {
                        item.subItems?.length
                          ?
                          <>
                            <NavigationMenuTrigger className={cn('cursor-pointer bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent/50')}>{item.text || 'null'}</NavigationMenuTrigger>
                            <NavigationMenuContent className={cn(
                              'relative group-data-[viewport=false]/navigation-menu:shadow-2xl origin-top group-data-[viewport=false]/navigation-menu:rounded-xl',
                              'before:absolute before:inset-2 before:bg-popover/30 before:rounded-md before:border before:border-border',
                              'group-data-[viewport=false]/navigation-menu:backdrop-blur',
                              'group-data-[viewport=false]/navigation-menu:bg-white/80 group-data-[viewport=false]/navigation-menu:dark:bg-black/80'
                            )}>
                              <ul className="grid w-[300px] gap-0 p-4 relative">
                                {item.subItems.map((subItem) => (
                                  <li key={subItem.text}>
                                    <NavigationMenuLink asChild className={cn('p-3')}>
                                      <Link href={subItem.href || '#'}>
                                        <span className="font-medium">{subItem.text}</span>
                                        <span className="text-foreground text-xs">
                                          {subItem.desc}
                                        </span>
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </NavigationMenuContent>
                          </>
                          :
                          <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent/50')}>
                            <Link href={item.href || '#'}>{item.text || 'null'}</Link>
                          </NavigationMenuLink>
                      }
                    </NavigationMenuItem>
                  ))
                }
              </NavigationMenuList>
              <motion.div className='flex items-center ml-auto' initial={false} animate={isOpen ? 'open' : 'closed'}>

                <SearchButton />

                <ThemeToggle className="cursor-pointer text-accent-foreground p-1" />


                <DialogTrigger asChild={true}>
                  <MenuToggle
                    toggle={() => toggleOpen()}
                    className="cursor-pointer text-accent-foreground md:hidden"
                  />
                </DialogTrigger>

              </motion.div>
            </div>
          </NavigationMenu>
        </header>
      </div>
      <DialogContent
        className={cn(
          `inset-0 translate-x-0 translate-y-0 max-w-full sm:max-w-full border-0 mt-[60px] p-0 md:hidden rounded-none border-none bg-white/80 dark:bg-black/80 backdrop-blur overflow-y-auto`,
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          'data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 z-49' //修补原样式
        )}
        showCloseButton={false}
        overlayClassName={'hidden'}
      >
        <nav
          className={cn("py-4")}
        >
          <h2 className='sr-only'>Site navigation</h2>
          <ul className='space-y-4'>
            {data.navMobile.map((item, idx) => (
              <div
                // variants={itemsVariants}
                key={`link=${idx}`}
                className='wrapper py-2 space-y-3'
              >
                <li>
                  {
                    item.href
                      ?
                      <Link
                        href={`${item.href}`}
                        onClick={() => toggleOpen(false)}
                        className=''
                      >
                        <span className='text-muted-foreground text-sm'>
                          {item.text}
                        </span>
                      </Link>
                      :
                      <span className='text-muted-foreground text-sm'>
                        {item.text}
                      </span>
                  }
                </li>
                {
                  item.subItems.length > 0 && item.subItems.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href={`${item.href}`}
                        onClick={() => toggleOpen(false)}
                        className=''
                      >
                        <span className='text-accent-foreground text-2xl'>
                          {item.text}
                        </span>
                      </Link>

                    </li>
                  ))
                }
              </div>
            ))}
          </ul>
        </nav>
        <DialogHeader className='sr-only'>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog >
  )
}
