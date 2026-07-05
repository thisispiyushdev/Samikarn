import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ExternalLink, Newspaper, Award, PlayCircle, Search, Filter } from 'lucide-react';

const Media = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/media`).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/announcements`).then(r => r.json())
    ]).then(([mediaRes, annRes]) => {
      if (mediaRes.success && mediaRes.media) {
        setMediaItems(mediaRes.media.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
      if (annRes.success && annRes.announcements) {
        const ann = annRes.announcements.map(a => ({
          ...a,
          type: a.type || 'Announcement',
          mainImage: a.image || a.media || a.mainImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
          date: a.date || a.createdAt
        }));
        setAnnouncements(ann.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    }).catch(err => console.error("Failed to fetch media/announcements:", err));
  }, []);

  const uniqueCategories = ['All', 'News', 'Event', 'Award', 'Press Release'];

  const filteredMedia = mediaItems.filter(item => {
    const matchesFilter = filter === 'All' || (item.type && item.type.toLowerCase() === filter.toLowerCase());
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filteredAnnouncements = announcements.filter(item => {
    const matchesFilter = filter === 'All' || (item.type && item.type.toLowerCase() === filter.toLowerCase());
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
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
      {mediaItems.length > 0 && (
        <div className="bg-primary text-white py-4 overflow-hidden flex border-y border-primary/20 shadow-inner">
          <motion.div
            className="flex whitespace-nowrap gap-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: Math.max(mediaItems.length * 3, 10),
            }}
          >
            {/* Duplicated list for seamless infinite scroll */}
            {[...mediaItems, ...mediaItems].map((item, idx) => (
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
            {uniqueCategories.map(t => (
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

      {/* Announcements Grid */}
      {filteredAnnouncements.length > 0 && (
        <section className="py-16 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-2">Updates</h2>
              <h3 className="text-4xl font-bold text-gray-900">Latest Announcements</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              <AnimatePresence mode="popLayout">
                {filteredAnnouncements.map((item, idx) => (
                  <motion.div 
                    key={item._id || item.id || idx}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                    <div className="h-64 relative overflow-hidden">
                      <img 
                        src={item.mainImage} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] shadow-xl">
                        {item.type}
                      </div>
                    </div>

                    <div className="p-10">
                      <div className="flex items-center gap-2 mb-4 text-secondary">
                        <Calendar size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight leading-tight uppercase group-hover:text-secondary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 font-medium text-sm line-clamp-3 mb-8 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Announcement</span>
                        {item.link && (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-2 text-secondary font-black text-xs tracking-widest hover:translate-x-1 transition-transform"
                          >
                            READ FULL <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Media Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredMedia.map((item, idx) => (
                <motion.div 
                  key={item._id || item.id || idx}
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

          {filteredMedia.length === 0 && filteredAnnouncements.length === 0 && (
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
