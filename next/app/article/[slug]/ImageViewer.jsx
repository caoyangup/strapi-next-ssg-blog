'use client'
import { useState } from 'react'
// import Image from 'next/image'
import { motion, AnimatePresence } from "motion/react"
const ImageViewer = ({ image }) => {
  // console.log(image);
  // return <></>
  // image: (props) => /* @__PURE__ */ jsxRuntime.jsx("img", { src: image.url, alt: image.alternativeText || void 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <>
      <motion.img
        src={image.src}
        alt={image.alt || void 0}
        // height={image.height}
        // width={image.width}
        onClick={toggleFullscreen}
        whileHover={{}}
        // transition={{ duration: 0.15 }}
        layoutId={image.src}
        key={image.src}
        className='rounded-lg object-contain cursor-zoom-in inline'
      />
      <AnimatePresence>
        {isFullscreen && (
          <>
            <motion.span
              className='fixed inset-0 z-50 backdrop-blur bg-black/30 overflow-hidden cursor-zoom-out'
              onClick={toggleFullscreen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.span>
            <span
              className='fixed inset-0 z-50 p-4 flex justify-center items-center overflow-hidden cursor-zoom-out'
              onClick={toggleFullscreen}
            >
              <motion.img
                src={image.src}
                alt={image.alt || void 0}
                onClick={toggleFullscreen}
                className='object-contain max-w-full max-h-[98vh] rounded-2xl overflow-hidden'
                layoutId={image.src}
              />
            </span>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageViewer
