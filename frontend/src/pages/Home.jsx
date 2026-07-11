import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import aboutImage from '../assets/media/about_story2.webp';

// Import extracted components
import HeroSection from '../components/sections/HeroSection';
import ImpactStats from '../components/sections/ImpactStats';
import LiveProjects from '../components/sections/LiveProjects';
import Testimonials from '../components/sections/Testimonials';
import DepthBlurCarousel from '../components/sections/DepthBlurCarousel';
import Snap3DCarousel from '../components/sections/Snap3DCarousel';

import { cachedFetch } from '../utils/cachedFetch';

const Home = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [impactStats, setImpactStats] = useState({
    studentsReached: '1650+',
    institutions: '14+',
    workshops: '20+'
  });
  const [liveProjects, setLiveProjects] = useState([]);
  const [currentMomentsSlide, setCurrentMomentsSlide] = useState(0);

  useEffect(() => {
    cachedFetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/gallery`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setGalleryItems(data.gallery);
      });
    
    cachedFetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/settings`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.settings.impactStats) {
          setImpactStats(data.settings.impactStats);
        }
      });

    cachedFetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/projects`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setLiveProjects(data.projects);
      });
  }, []);

  const openModal = (event) => {
    setSelectedEvent(event);
    setCurrentImgIdx(0);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const nextImg = () => {
    if (!selectedEvent?.gallery) return;
    setCurrentImgIdx((prev) => (prev + 1) % (selectedEvent.gallery.length + 1));
  };

  const prevImg = () => {
    if (!selectedEvent?.gallery) return;
    const total = selectedEvent.gallery.length + 1;
    setCurrentImgIdx((prev) => (prev - 1 + total) % total);
  };

  const allImages = selectedEvent ? [selectedEvent.mainImage || selectedEvent.image, ...(selectedEvent.gallery || [])].filter(Boolean) : [];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Impact Stats */}
      <ImpactStats stats={impactStats} />

      {/* Quick About */}
      <section className="py-24 bg-white">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                  <div className="w-full h-[500px] rounded-xl overflow-hidden relative shadow-2xl flex items-center justify-center bg-[#fdf9ee] group">
                      <svg viewBox="0 0 500 500" className="w-full h-full group-hover:scale-105 transition-transform duration-700">
                          {/* Top circle */}
                          <circle cx="135" cy="145" r="35" fill="#f9d36a" />
                          {/* Top bar */}
                          <rect x="100" y="200" width="300" height="40" fill="#4a6730" />
                          {/* Bottom bar */}
                          <rect x="100" y="260" width="300" height="40" fill="#4a6730" />
                          {/* Bottom circle */}
                          <circle cx="365" cy="355" r="35" fill="#f9d36a" />
                      </svg>
                  </div>
              </div>
              <div>
                  <h2 className="text-2xl font-bold tracking-wide text-secondary uppercase mb-2">About Us</h2>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                      Samikaran is a social initiative focused on building communication, confidence, and professional skills among students and youth, especially from underserved communities.
                  </p>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      Our focus is simple to build an able society where every individual leads a life of purpose.
                  </p>
                  <Link to="/about" className="text-primary font-bold hover:brightness-90 inline-flex items-center gap-2 text-lg group">
                      Read Our Full Story <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
          </div>
      </section>

      {/* Featured Projects Preview */}
      <LiveProjects liveProjects={liveProjects} />

      {/* Moments Carousel Section — Stacked Card Parallax */}
      <Snap3DCarousel items={galleryItems} isPaused={!!selectedEvent} onImageClick={(item, idx) => openModal(galleryItems[idx])} />

      {/* Playbook Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
            {/* Background Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl pointer-events-auto"
              onClick={closeModal}
            />

            <div className="container mx-auto h-full flex flex-col items-center justify-center p-4 z-10 pointer-events-auto">
              {/* Close button at top right corner */}
              <button 
                onClick={closeModal}
                aria-label="Close modal"
                className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-[110] backdrop-blur-md border border-white/20"
              >
                <X size={24} />
              </button>

              <motion.div 
                className="w-full max-w-5xl relative group flex flex-col items-center"
              >
                {/* Image Section */}
                <div className="w-full relative flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImgIdx}
                      layoutId={currentImgIdx === 0 ? `carousel-img-${selectedEvent._id || galleryItems.indexOf(selectedEvent)}` : undefined}
                      initial={{ opacity: currentImgIdx === 0 ? 1 : 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: currentImgIdx === 0 ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
                      style={{ borderRadius: 16 }}
                      src={allImages[currentImgIdx]} 
                      className="w-full h-[50vh] md:h-[70vh] object-cover shadow-2xl"
                      alt="Gallery item"
                    />
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 md:px-6 opacity-0 group-hover:opacity-100 transition-opacity z-[100] pointer-events-none">
                      <button aria-label="Previous image" onClick={prevImg} className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary transition-colors">
                        <ChevronLeft size={32} />
                      </button>
                      <button aria-label="Next image" onClick={nextImg} className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary transition-colors">
                        <ChevronRight size={32} />
                      </button>
                    </div>
                  )}

                  {/* Progress Indicators */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-[100]">
                      {allImages.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImgIdx ? 'w-8 bg-primary' : 'w-2 bg-white/50'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Title block attached to the bottom */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center w-full max-w-3xl"
                >
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                    {selectedEvent.title}
                  </h2>
                  {selectedEvent.date && (
                    <p className="text-white/70 font-bold mt-2 drop-shadow-md uppercase tracking-widest text-sm">
                      {new Date(selectedEvent.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <section className="py-24 bg-secondary relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
           <div className="container mx-auto px-4 text-center relative z-10">
               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Join Hands With Us</h2>
               <p className="text-xl text-gray-800 mb-10 max-w-2xl mx-auto">
                   Your contribution can light up a life. Volunteer, donate, or spread the word.
               </p>
               <div className="flex gap-4 justify-center">
                   <Link to="/contact" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-colors">
                       Become a Volunteer
                   </Link>
                   <Link to="/donate" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors">
                       Make a Donation
                   </Link>
               </div>
           </div>
      </section>
    </div>
  );
};

export default Home;
