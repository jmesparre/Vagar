'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';
import { SearchBarSkeleton } from './SearchBarSkeleton';
import { H1, Lead } from '@/components/ui/typography';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  videoSrc: string;
  title: string;
  subtitle: string;
  showSearchBar?: boolean;
}

const HeroSection = ({
  videoSrc,
  title,
  subtitle,
  showSearchBar = true,
}: HeroSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500); // Simular carga
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (filters: {
    guests: number;
    amenities: string[];
    startDate?: string;
    endDate?: string;
  }) => {
    const params = new URLSearchParams();

    if (filters.guests > 0) {
      params.append('guests', filters.guests.toString());
    }
    if (filters.amenities.length > 0) {
      params.append('amenities', filters.amenities.join(','));
    }
    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }

    router.push(`/chalets?${params.toString()}`);
  };

  // Animation Variants
  const heroTextVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  const staggerContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <section className="relative shadow-lg border-b h-screen flex flex-col justify-center items-center text-white p-4">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Tu navegador no soporta la etiqueta de video.
      </video>

      {/* Overlay */}
      <div className="absolute z-10 w-full h-full bg-black opacity-50"></div>

      {/* Content Wrapper */}
      <div className="z-20 flex flex-col items-center justify-between h-full w-full pt-8 pb-12">

        {/* SearchBar in the middle */}
        <div className="w-full flex justify-center pt-11.5">
          {showSearchBar && (isLoading ? <SearchBarSkeleton /> : <SearchBar onSearch={handleSearch} />)}
        </div>

        {/* Title at the bottom */}
        <motion.div
          className="flex-grow text-center flex flex-col max-w-[100%] md:max-w-[60%]"
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
        >
          <motion.div variants={heroTextVariants}>
            <H1 className="mt-20 md:mt-10 font-bold leading-tight mb-4">
              {title}
            </H1>
          </motion.div>

          <motion.div variants={heroTextVariants}>
            <Lead className="text-md">{subtitle}</Lead>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
