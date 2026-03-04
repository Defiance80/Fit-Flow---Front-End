"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const authImages = [
  {
    src: "/images/auth/fitness-gym.jpg",
    quote: "Your body can stand almost anything. It's your mind that you have to convince.",
    credit: "Anonymous",
  },
  {
    src: "/images/auth/fitness-training.jpg",
    quote: "The only bad workout is the one that didn't happen.",
    credit: "Anonymous",
  },
  {
    src: "/images/auth/yoga-wellness.jpg",
    quote: "Take care of your body. It's the only place you have to live.",
    credit: "Jim Rohn",
  },
  {
    src: "/images/auth/strength-workout.jpg",
    quote: "Strength does not come from physical capacity. It comes from an indomitable will.",
    credit: "Mahatma Gandhi",
  },
];

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({ children }) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % authImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const current = authImages[currentImage];

  return (
    <div className="min-h-screen flex bg-[#0F172A]">
      {/* Left side — Image carousel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {authImages.map((img, index) => (
          <div
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img.src}
              alt="Fitness & Wellness"
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-[#0F172A]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          </div>
        ))}

        {/* Quote overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
          <div className="max-w-lg">
            <p className="text-white/90 text-xl font-light italic leading-relaxed mb-3">
              &ldquo;{current.quote}&rdquo;
            </p>
            <p className="text-white/60 text-sm">— {current.credit}</p>
          </div>

          {/* Image indicators */}
          <div className="flex gap-2 mt-6">
            {authImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === currentImage
                    ? "w-8 bg-white"
                    : "w-4 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Logo on image side */}
        <div className="absolute top-8 left-8 z-10">
          <Image
            src="/fitflow-logo.png"
            alt="Fit Flow"
            width={140}
            height={46}
            className="object-contain"
          />
        </div>
      </div>

      {/* Right side — Auth form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/fitflow-logo.png"
              alt="Fit Flow"
              width={140}
              height={46}
              className="object-contain"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;
