import React from 'react'
import { cn } from "@/lib/utils"
import Image from 'next/image'

interface MainLoaderProps {
  className?: string;
}

const MainLoader = ({ className }: MainLoaderProps) => {
  return (
    <div className={cn("fixed inset-0 flex flex-col items-center justify-center bg-[#0F172A] z-50", className)}>
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Image
            src="/fitflow-logo.png"
            alt="Fit Flow"
            width={120}
            height={120}
            className="object-contain animate-pulse"
            priority
          />
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#0D9488]"
              style={{
                animation: `bounce-dot 1.4s infinite ease-in-out both`,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
        <style jsx>{`
          @keyframes bounce-dot {
            0%, 80%, 100% {
              transform: scale(0.4);
              opacity: 0.4;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default MainLoader
