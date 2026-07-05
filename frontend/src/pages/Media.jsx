import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ExternalLink, Newspaper, Award, PlayCircle, Search, Filter } from 'lucide-react';

const Media = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/media')
      .then(r => r.json())
      .then(data => {
        if (data.success) setItems(data.media);
      });
  }, []);

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'All' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-6 block"
          >
            Media & News
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8"
          >
            SAMIKARAN IN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">THE SPOTLIGHT</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg font-medium"
          >
            Explore our latest news coverage, internal events, and recognitions as we continue our mission of social transformation.
          </motion.p>
        </div>
      </section>

      {/* Dynamic Marquee Component */}
      {items.length > 0 && (
        <div className="bg-primary text-white py-4 overflow-hidden flex border-y border-primary/20 shadow-inner">
          <motion.div
            className="flex whitespace-nowrap gap-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: Math.max(items.length * 3, 10),
            }}
          >
            {/* Duplicated list for seamless infinite scroll */}
            {[...items, ...items].map((item, idx) => (
              <div key={idx} className="flex items-center gap-12">
                <span className="text-sm font-black uppercase tracking-[0.2em]">
                  {item.title}
                </span>
                <span className="text-secondary/50 font-black">/</span>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <section className="py-12 border-b border-gray-100 bg-white sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
            {['All', 'News', 'Event', 'Headline', 'Award'].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-8 py-3 rounded-xl font-black text-xs tracking-widest transition-all ${filter === t ? 'bg-gray-900 text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search news & events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-8 focus:ring-gray-100 outline-none transition-all font-bold text-gray-900"
            />
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div 
                  key={item._id || item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="flex flex-col gap-4 group cursor-pointer"
                  onClick={() => { if(item.link) window.open(item.link, '_blank'); }}
                >
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 relative">
                    <img 
                      src={item.mainImage} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 uppercase shadow-sm">
                      {item.type}
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="shrink-0 ml-4 border border-gray-200 px-4 py-1 rounded-full text-sm font-bold text-gray-900">
                      {new Date(item.date).getFullYear()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div className="py-40 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mx-auto mb-8">
                <Newspaper size={48} />
              </div>
              <h4 className="text-2xl font-black text-gray-400 tracking-tight uppercase">No records found</h4>
              <p className="text-sm text-gray-300 font-bold uppercase tracking-widest mt-2">Adjust your filters or search terms</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Media;
