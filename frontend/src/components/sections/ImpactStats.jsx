import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = ({ text, className }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!text) return;
    const rawVal = text.toString();
    const numericPart = parseInt(rawVal.replace(/[^0-9]/g, ''), 10) || 0;
    // Extract non-numeric characters (like + or k)
    const suffixPart = rawVal.replace(/[0-9.,]/g, '');

    const obj = { val: 0 };

    let ctx = gsap.context(() => {
      // Zoom effect
      gsap.fromTo(nodeRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: nodeRef.current,
            start: "top 90%"
          }
        }
      );

      // Number count up effect
      gsap.to(obj, {
        val: numericPart,
        duration: 2.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: nodeRef.current,
          start: "top 90%"
        },
        onUpdate: () => {
          if (nodeRef.current) {
            let currentVal = Math.round(obj.val);
            let displayVal = currentVal >= 1000 ? currentVal.toLocaleString() : currentVal;
            if (rawVal.toLowerCase().includes('k')) {
                displayVal = currentVal;
            }
            nodeRef.current.innerHTML = `${displayVal}<span>${suffixPart}</span>`;
          }
        }
      });
    });
    return () => ctx.revert();
  }, [text]);

  return <span ref={nodeRef} className={`inline-block transform-origin-bottom ${className || ''}`}>{text}</span>;
};

const ImpactStats = ({ stats }) => {
  return (
    <section className="py-12 md:py-32 bg-[#FAF9F6] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tight"
          >
            OUR <span className="text-[#5C6B38]">IMPACT</span> IN ACTION
          </motion.h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around w-full mt-12 md:mt-16 space-y-16 md:space-y-0">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <h3 className="text-6xl md:text-7xl font-black text-[#5C6B38] tracking-tight">
              <AnimatedCounter text={stats?.studentsReached || '1,650+'} />
            </h3>
            <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mt-3">STUDENTS REACHED</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h3 className="text-6xl md:text-7xl font-black text-[#5C6B38] tracking-tight">
              <AnimatedCounter text={stats?.institutions || '14+'} />
            </h3>
            <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mt-3">INSTITUTIONS</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h3 className="text-6xl md:text-7xl font-black text-[#5C6B38] tracking-tight">
              <AnimatedCounter text={stats?.workshops || '20+'} />
            </h3>
            <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mt-3">WORKSHOPS CONDUCTED</p>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
