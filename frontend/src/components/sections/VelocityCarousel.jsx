import React, { useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, wrap } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';

const VelocityCarousel = ({ items = [], onImageClick }) => {
  if (!items || items.length === 0) return null;

  // Duplicate items to ensure smooth infinite scrolling
  const duplicatedItems = [...items, ...items, ...items, ...items];
  
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="relative w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/80 via-primary to-black py-32 min-h-[90vh] flex flex-col justify-center">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-30 pointer-events-none">
        <svg width="60" height="100" viewBox="0 0 40 60" fill="none">
           {[...Array(15)].map((_, i) => (
              <circle key={i} cx={5 + (i%3)*15} cy={5 + Math.floor(i/3)*15} r="2.5" fill="#FBBF24"/>
           ))}
        </svg>
      </div>

      {/* Section Header */}
      <div className="text-center px-4 z-10 mb-16">
        <div className="text-yellow-400 font-black uppercase tracking-[0.3em] text-xs mb-3 block">
          Our Playbook
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Moments That Define Us
        </h2>
      </div>

      {/* Infinite Scrolling Track */}
      <div 
        className="relative flex items-center w-full overflow-hidden" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredIndex(null);
        }}
      >
        <motion.div
          className="flex gap-8 px-4 animate-marquee-horizontal"
          style={{
            animationPlayState: isHovered ? 'paused' : 'running',
            width: 'max-content'
          }}
        >
          {duplicatedItems.map((item, idx) => {
            const isCardHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;
            
            return (
              <div
                key={`${item._id || item.id}-${idx}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                className={`relative flex-shrink-0 cursor-pointer overflow-hidden rounded-[2.5rem] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border border-white/10 shadow-2xl bg-black/20`}
                style={{
                  width: '720px',
                  height: '405px',
                  opacity: isAnyHovered && !isCardHovered ? 0.4 : 1,
                  filter: isAnyHovered && !isCardHovered ? 'grayscale(50%)' : 'grayscale(0%)',
                  zIndex: isCardHovered ? 20 : 10,
                  transform: isAnyHovered && !isCardHovered ? 'scale(0.95)' : isCardHovered ? 'translateY(-15px) scale(1.02)' : 'scale(1)',
                  boxShadow: isCardHovered ? '0 30px 60px -12px rgba(236, 89, 54, 0.25), 0 18px 36px -18px rgba(0,0,0,0.8), inset 0 0 20px rgba(255, 255, 255, 0.1)' : '0 10px 30px -5px rgba(0, 0, 0, 0.5)'
                }}
                onClick={() => onImageClick && onImageClick(item, idx % items.length)}
              >
                {/* Image Background */}
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={item.mainImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop'} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end text-white h-full pointer-events-none">
                  <div className="mb-auto">
                    <span className="bg-accent/90 backdrop-blur-xl text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] inline-block mb-4 shadow-lg border border-white/20">
                      {item.type || 'Media'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-extrabold mb-3 leading-tight tracking-tight text-white/95">
                      {item.title}
                    </h3>
                    
                    {/* Expandable details */}
                    <div 
                      className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      style={{
                        maxHeight: isCardHovered ? '200px' : '0px',
                        opacity: isCardHovered ? 1 : 0,
                        transform: isCardHovered ? 'translateY(0)' : 'translateY(20px)'
                      }}
                    >
                      <p className="text-white/70 text-sm mb-5 line-clamp-3 leading-relaxed font-medium">
                        {item.description}
                      </p>
                      
                      {item.date && (
                        <div className="flex items-center gap-2 text-xs font-bold text-white/50 mb-5 tracking-wide uppercase">
                          <Calendar size={14} className="text-yellow-400/80" />
                          {new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-yellow-400 font-extrabold text-sm tracking-widest uppercase transition-colors">
                        View Details <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default VelocityCarousel;
