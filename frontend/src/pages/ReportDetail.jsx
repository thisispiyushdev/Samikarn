import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, CheckCircle, Heart, X, ChevronLeft, ChevronRight, ZoomIn, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getImgStatic = (item) => item.image || item.url || item.media || '';

const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState({ open: false, index: 0 });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/reports/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setReport(data.report);
                } else {
                    navigate('/impact');
                }
            })
            .catch(err => {
                console.error(err);
                navigate('/impact');
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const allImages = report ? [getImgStatic(report), ...(report.gallery || [])].filter(Boolean) : [];

    const openLightbox = (index) => { if (allImages.length > 0) setLightbox({ open: true, index }); };
    const closeLightbox = () => setLightbox({ open: false, index: 0 });

    const goNext = useCallback(() => {
        setLightbox(prev => ({ ...prev, index: (prev.index + 1) % allImages.length }));
    }, [allImages.length]);

    const goPrev = useCallback(() => {
        setLightbox(prev => ({ ...prev, index: (prev.index - 1 + allImages.length) % allImages.length }));
    }, [allImages.length]);

    useEffect(() => {
        if (!lightbox.open) return;
        const handler = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightbox.open, goNext, goPrev]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
        );
    }

    if (!report) return null;

    const coverImg = getImgStatic(report);

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-secondary/20 selection:text-secondary">
            {/* Header Section */}
            <section className="relative w-full pt-[20vh] pb-[10vh] px-5 md:px-10 flex flex-col items-center justify-center text-center bg-white border-b border-gray-100">
                <Link to="/impact" className="absolute top-8 left-8 md:left-12 flex items-center gap-2 text-gray-500 hover:text-secondary transition-colors font-bold text-sm uppercase tracking-widest z-10">
                    <ArrowLeft size={16} /> Back
                </Link>
                
                <p className="text-sm font-bold uppercase tracking-widest text-secondary mb-6">Publication</p>
                <h1 className="font-black text-5xl md:text-8xl leading-[0.9] tracking-tighter mb-10 text-gray-900 drop-shadow-sm max-w-6xl mx-auto">
                    {report.title}
                </h1>
                
                <div className="w-full max-w-5xl flex flex-row flex-wrap justify-center gap-8 md:gap-14 border-t border-gray-200 py-10 text-center">
                    <div className="min-w-[100px]">
                        <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Status</span>
                        <span className="font-bold text-gray-900 text-lg">{report.status || 'Published'}</span>
                    </div>
                    {report.date && (
                        <div className="min-w-[100px]">
                            <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Date</span>
                            <span className="font-bold text-gray-900 text-lg">{report.date}</span>
                        </div>
                    )}
                    {report.description && (
                        <div className="min-w-[100px] max-w-xs">
                            <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Overview</span>
                            <span className="font-bold text-gray-900 text-sm leading-relaxed block">{report.description}</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Cover Image Section */}
            {coverImg && (
                <section className="w-full px-5 md:px-10 mb-20 -mt-10 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full aspect-[21/9] md:aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-gray-900 cursor-pointer group"
                        onClick={() => openLightbox(0)}
                    >
                        <img 
                            src={coverImg} 
                            alt={report.title} 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-md rounded-full p-5">
                                <ZoomIn className="text-white w-8 h-8" />
                            </div>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* No cover image fallback */}
            {!coverImg && (
                <section className="w-full px-5 md:px-10 mb-20 -mt-10 relative z-10">
                    <div className="relative w-full aspect-[21/9] md:aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-secondary/10 flex items-center justify-center">
                        <FileText size={80} className="text-secondary opacity-30" />
                    </div>
                </section>
            )}

            {/* About / Content Section */}
            <section className="w-full max-w-4xl mx-auto px-5 mb-32">
                <h3 className="text-3xl font-black mb-8 text-gray-900">About this Publication</h3>
                <div className="prose prose-xl prose-headings:font-bold prose-headings:text-gray-900 text-gray-600 prose-p:leading-relaxed max-w-none">
                    {report.fullContent || report.full_content ? (
                        <div dangerouslySetInnerHTML={{ __html: report.fullContent || report.full_content }} />
                    ) : (
                        <p>{report.description}</p>
                    )}
                </div>

                {/* External link */}
                {report.link && (
                    <a 
                        href={report.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-secondary text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-secondary/90 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <ExternalLink size={18} /> View Full Report
                    </a>
                )}
            </section>

            {/* Stats Section */}
            {report.stats && report.stats.length > 0 && (
                <section className="relative w-full" style={{ height: `${report.stats.length * 100}vh` }}>
                    <div className="sticky top-0 left-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-gray-900 text-white px-4">
                        <h2 className="absolute top-10 text-xl font-bold uppercase tracking-widest text-white/30 z-20">Key Findings</h2>
                        
                        <div className="relative w-full h-full flex items-center justify-center pt-10">
                            {report.stats.map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ margin: "-200px" }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute w-[90vw] md:w-[60vw] aspect-[16/9] flex flex-col items-center justify-center bg-[#1a1a1a] rounded-[2rem] border border-white/10 shadow-2xl p-10 text-center"
                                    style={{ 
                                        zIndex: i, 
                                        transform: `rotate(${(i % 2 === 0 ? 1 : -1) * ((i * 1.5) + 1)}deg)`,
                                        top: `calc(10vh + ${i * 20}px)`
                                    }}
                                >
                                    <CheckCircle size={48} className="text-secondary mb-6 opacity-50" />
                                    <div className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary to-cyan-400 mb-4 drop-shadow-lg">
                                        {stat.value}
                                    </div>
                                    <div className="text-xl md:text-3xl font-bold uppercase tracking-widest text-white/80">
                                        {stat.label}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-[2rem] pointer-events-none" />
                                </motion.div>
                            ))}
                        </div>
                        
                        <div className="absolute bottom-10 flex flex-col items-center gap-2 z-20 pointer-events-none">
                            <p className="text-sm font-bold uppercase tracking-widest text-white/30 animate-pulse">Keep Scrolling</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery Grid Section */}
            {report.gallery && report.gallery.length > 0 && (
                <section className="w-full py-10 md:py-24 px-5 md:px-10 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="text-sm font-bold uppercase tracking-widest text-secondary mb-3">Visual Documentation</p>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Gallery</h2>
                        </div>

                        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                            {report.gallery.map((img, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    className="break-inside-avoid group cursor-pointer relative rounded-2xl overflow-hidden bg-gray-100"
                                    onClick={() => openLightbox(i + 1)}
                                >
                                    <img 
                                        src={img} 
                                        alt={`${report.title} - Image ${i + 1}`}
                                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 bg-white/10 backdrop-blur-md rounded-full p-4">
                                            <ZoomIn className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                            {i + 1} / {report.gallery.length}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Full-Screen Lightbox */}
            <AnimatePresence>
                {lightbox.open && allImages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        <button 
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-colors"
                        >
                            <X className="text-white w-6 h-6" />
                        </button>

                        <div className="absolute top-6 left-6 z-50">
                            <span className="text-white/60 text-sm font-bold tracking-widest">
                                {lightbox.index + 1} / {allImages.length}
                            </span>
                        </div>

                        {allImages.length > 1 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                className="absolute left-4 md:left-8 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 md:p-4 transition-all hover:scale-110"
                            >
                                <ChevronLeft className="text-white w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        )}

                        {allImages.length > 1 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                                className="absolute right-4 md:right-8 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 md:p-4 transition-all hover:scale-110"
                            >
                                <ChevronRight className="text-white w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        )}

                        <AnimatePresence mode="wait">
                            <motion.img 
                                key={lightbox.index}
                                src={allImages[lightbox.index]}
                                alt={`Image ${lightbox.index + 1}`}
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ duration: 0.25 }}
                                className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl select-none"
                                onClick={(e) => e.stopPropagation()}
                                draggable={false}
                            />
                        </AnimatePresence>

                        {allImages.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-white/5 backdrop-blur-md rounded-full px-3 py-2 max-w-[90vw] overflow-x-auto">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setLightbox(prev => ({ ...prev, index: i })); }}
                                        className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                            i === lightbox.index 
                                                ? 'border-white scale-110 shadow-lg' 
                                                : 'border-transparent opacity-50 hover:opacity-80'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Call to Action */}
            <section className="w-full py-10 md:py-24 px-5 md:px-10 border-t border-gray-200 bg-white flex justify-center">
                <Link to="/donate" className="group flex flex-col items-center gap-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-secondary transition-colors">Inspired by this?</span>
                    <div className="flex items-center gap-2">
                        <span className="text-4xl md:text-6xl font-black group-hover:text-secondary transition-colors text-gray-900">Support a Cause</span>
                        <Heart className="w-8 h-8 md:w-12 md:h-12 group-hover:text-secondary group-hover:scale-110 transition-all text-gray-900" />
                    </div>
                </Link>
            </section>
        </main>
    );
};

export default ReportDetail;
