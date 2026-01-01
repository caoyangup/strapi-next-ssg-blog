"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"

export default function ThemeToggle({ ...props }) {
    const { theme, setTheme } = useTheme()
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const iconVariants = {
        hidden: {
            scale: 0,
            rotate: -90,
            opacity: 0,
        },
        visible: {
            scale: 1,
            rotate: 0,
            opacity: 1,
        },
        exit: {
            scale: 0,
            rotate: 90,
            opacity: 0,
        },
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            {...props}
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}  >
                <motion.div
                    key={theme}
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.1 }}
                >
                    {theme === "dark" ? <Moon /> : <Sun />}
                </motion.div>
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}