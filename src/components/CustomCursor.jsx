import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const isTouch = window.matchMedia('(pointer: coarse)')?.matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')?.matches
    if (isTouch || prefersReducedMotion) return

    setIsVisible(true)

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const onMouseOver = (e) => {
      const target = e.target
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.dataset.cursor === 'hover'

      setIsHovered(!!isInteractive)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
    }
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference hidden md:block"
      animate={{
        x: mousePosition.x - (isHovered ? 24 : 6),
        y: mousePosition.y - (isHovered ? 24 : 6),
        width: isHovered ? 48 : 12,
        height: isHovered ? 48 : 12,
        backgroundColor: isHovered ? 'rgba(8, 184, 240, 0.4)' : '#08B8F0',
        border: isHovered ? '1px solid rgba(255, 255, 255, 0.8)' : 'none',
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.1,
      }}
    />
  )
}

