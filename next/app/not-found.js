import Link from 'next/link'
import { Button } from '@/components/ui/button'
export default function NotFound() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center">
                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-accent-foreground">404 Not Found</h2>
                <p className="leading-7 [&:not(:first-child)]:mt-6 mb-4">无法找到请求的资源</p>
                <Button asChild>
                    <Link href="/" className="">返回首页</Link>
                </Button>

            </div>
        </div>
    )
}