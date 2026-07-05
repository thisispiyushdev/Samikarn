import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Heart } from 'lucide-react';
import heroBg from '../../assets/media/hero_bg.webp';

import { cachedFetch } from '../../utils/cachedFetch';

const HeroSection = () => {
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  
  const hardcodedImage = heroBg;
  const [heroImages, setHeroImages] = useState([hardcodedImage]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await cachedFetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/media`);
        const data = await res.json();
        if (data.success && data.media.length > 0) {
          setHeroImages([hardcodedImage, ...data.media.map(m => m.mainImage || m.url)]);
        }
      } catch (err) {
        console.error("Failed to fetch carousel images:", err);
      }
    };
    fetchMedia();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const heroRef = useRef(null);
  
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".hero-element", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.1 }
      );
    }, heroRef);
    
    return () => ctx.revert();
  }, []);

  const { scrollY } = useScroll();
  // Parallax effect: as you scroll down, the background images move down at 40% speed
  const yParallax = useTransform(scrollY, [0, 1000], [0, 400]);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-10 bg-black">
      
      {/* Parallax Background Container */}
      <motion.div 
        style={{ y: yParallax }} 
        className="absolute inset-[-10%] w-[120%] h-[120%] z-0"
      >
        <AnimatePresence mode="popLayout">
            <motion.img 
                key={currentHeroIdx}
                initial={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                src={heroImages[currentHeroIdx]} 
                alt="NGO Background" 
                className="w-full h-full object-cover absolute inset-0"
            />
        </AnimatePresence>
      </motion.div>
      
      {/* Dark overlay to ensure text is always readable against the full-screen images */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Decorative blurred lighting to add premium feel */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-400/20 rounded-full blur-[100px] pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-teal-400/20 rounded-full blur-[100px] pointer-events-none z-10" />
      
      <div className="container mx-auto px-4 z-20 flex flex-col items-center text-center w-full max-w-5xl">
        
        
        <h1 className="hero-element text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-tight mb-6 md:mb-8 text-white drop-shadow-2xl tracking-tighter whitespace-nowrap">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-400 drop-shadow-md">Samikaran</span>
        </h1>

        {/* Subtext */}
        <p className="hero-element text-xl md:text-2xl text-white/90 mb-12 max-w-3xl leading-relaxed font-medium">
          Building an able society where every individual leads a life of purpose
        </p>
        
        {/* Pill Buttons */}
        <div className="hero-element flex gap-4 md:gap-6 flex-wrap justify-center">
          <Link 
            to="/donate" 
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            <Heart size={18} fill="currentColor" className="animate-pulse" />
            <span>Donate</span>
          </Link>
          <Link 
            to="/about" 
            className="bg-white/10 backdrop-blur-md border border-white/50 text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-white/20 transition-all shadow-lg"
          >
            Learn More
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
