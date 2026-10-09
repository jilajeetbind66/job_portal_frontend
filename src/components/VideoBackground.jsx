import React, { useEffect, useRef, useState } from 'react'

export default function VideoBackground({ src, poster }) {
  const videoRef = useRef(null)
  const [videoFailed, setVideoFailed] = useState(!src)

  useEffect(() => {
    if (!src || !videoRef.current) return

    const video = videoRef.current
    video.muted = true

    const playVideo = async () => {
      try {
        await video.play()
      } catch (err) {
        console.warn('Autoplay fallback to atmospheric background:', err)
        setVideoFailed(true)
      }
    }

    playVideo()
  }, [src])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {src && !videoFailed ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoFailed(true)}
          className="w-full h-full object-cover opacity-35 filter brightness-90 saturate-125"
        />
      ) : null}

      {/* Cybernetic Radial Orbs & Canvas Background */}
      <div className="absolute inset-0 bg-[#05070D]">
        <div className="absolute top-1/4 left-1/5 w-[550px] h-[550px] rounded-full bg-[#08B8F0]/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/5 w-[650px] h-[650px] rounded-full bg-[#32128F]/25 blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#0877E8]/15 blur-[160px] pointer-events-none" />

        {/* Ambient Grid */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none" 
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 noise-bg opacity-[0.05] pointer-events-none" />
      </div>
    </div>
  )
}

