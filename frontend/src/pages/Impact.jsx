import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight, Calendar, ExternalLink, X, MapPin, CheckCircle, Heart, Megaphone, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { cachedFetch } from '../utils/cachedFetch';

const BentoCard = ({ children, className, delay = 0, onClick, hoverable = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    onClick={onClick}
    className={`bg-white rounded-xl p-6 md:p-8 border border-gray-100 shadow-sm overflow-hidden relative group flex flex-col ${hoverable ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

const Impact = () => {
  const navigate = useNavigate();
  const [liveProjects, setLiveProjects] = useState([]);
  const [liveReports, setLiveReports] = useState([]);
  const [liveAnnouncements, setLiveAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [impactStats, setImpactStats] = useState({
    studentsReached: '1650+',
    institutions: '14+',
    workshops: '20+'
  });

  useEffect(() => {
    Promise.all([
      cachedFetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/projects`).then(res => res.json()),
      cachedFetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/reports`).then(res => res.json()),
      cachedFetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/announcements`).then(res => res.json()),
      cachedFetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/settings`).then(res => res.json()).catch(() => ({}))
    ]).then(([p, r, a, s]) => {
      if(p.success) setLiveProjects(p.projects);
      if(r.success) setLiveReports(r.reports);
      if(a.success) setLiveAnnouncements(a.announcements);
      if(s && s.success && s.settings && s.settings.impactStats) setImpactStats(s.settings.impactStats);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getImg = (item) => item.image || item.media || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="bg-gray-50 min-h-screen pt-0 pb-20 relative font-sans selection:bg-primary/20">
        

      {/* Programs and Journey */}
      <section className="bg-gray-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Our Journey & Programs</h2>
              <h3 className="text-4xl font-bold mb-6">Creating Spaces for Growth</h3>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                Samikaran started with a simple belief: confidence and opportunity should not depend on where someone begins their journey. Over time, we have worked with schools, colleges, ITIs, and learning centres to conduct interactive workshops and learning programs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mt-16">
                {/* Baat-Cheet */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 p-8 rounded-xl border border-white/10"
                >
                    <h4 className="text-3xl font-bold text-secondary mb-4">Baat-Cheet</h4>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        A learning program designed to help children express themselves more openly and confidently. Through activities, discussions, and creative exercises, students explore their thoughts, emotions, and communication skills in a supportive environment. The program focuses on social-emotional learning along with English comprehension.
                    </p>
                    <div className="bg-white/10 p-6 rounded-xl">
                        <h5 className="font-bold text-white mb-2">Pilot Programme (3 Months)</h5>
                        <p className="text-gray-400 text-sm">
                            Conducted at Lakhi Ram Anathalaya, engaging children in creative sessions on social-emotional learning and English. Through games, storytelling, and discussions, we built their confidence to express and work together.
                        </p>
                    </div>
                </motion.div>

                {/* Sahi Manzil */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 p-8 rounded-xl border border-white/10"
                >
                    <h4 className="text-3xl font-bold text-primary mb-4">Sahi Manzil</h4>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        A workshop series focused on professional development and skill building for students. It introduces communication, digital tools, presentation, and career awareness, guiding students towards the right direction with skills needed in today's world.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <div>
                                <h5 className="font-bold text-white">In Schools</h5>
                                <p className="text-gray-400 text-sm">Focuses on creativity, communication, and digital tools like Canva and AI platforms.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                            <div>
                                <h5 className="font-bold text-white">In Colleges</h5>
                                <p className="text-gray-400 text-sm">Covers resume building, communication, modern workplace expectations, and professional development.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                            <div>
                                <h5 className="font-bold text-white">In ITIs</h5>
                                <p className="text-gray-400 text-sm">Strengthens communication, confidence, and awareness of opportunities for students with strong technical knowledge.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* Upcoming & Stats */}
      <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-12">
              <div className="md:col-span-5">
                  <h3 className="text-4xl font-bold text-gray-900 mb-8">Our Impact</h3>
                  <div className="space-y-8">
                      <div>
                          <h4 className="text-5xl font-black text-primary mb-2">{impactStats.studentsReached || '1650+'}</h4>
                          <p className="text-xl font-bold text-gray-900 mb-1">Students Reached</p>
                          <p className="text-gray-600">Engaged through skill-building workshops and learning initiatives.</p>
                      </div>
                      <div>
                          <h4 className="text-5xl font-black text-secondary mb-2">{impactStats.institutions || '14+'}</h4>
                          <p className="text-xl font-bold text-gray-900 mb-1">Institutions</p>
                          <p className="text-gray-600">Collaborated with schools, colleges, and ITIs.</p>
                      </div>
                      <div>
                          <h4 className="text-5xl font-black text-accent mb-2">{impactStats.workshops || '20+'}</h4>
                          <p className="text-xl font-bold text-gray-900 mb-1">Workshops Conducted</p>
                          <p className="text-gray-600">Focused on communication, creativity, and professional development.</p>
                      </div>
                  </div>
              </div>

              <div className="md:col-span-7 space-y-8">
                  <h3 className="text-4xl font-bold text-gray-900 mb-8">Upcoming Initiatives</h3>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                  >
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">Baat-Cheet Activity Booklet</h4>
                      <p className="text-gray-600 mb-4">
                          We are launching an activity-based booklet designed to support social and emotional learning along with English comprehension for children. It includes 40+ interactive activities for children aged 7–17.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <span className="font-bold text-gray-900">Goal:</span> <span className="text-gray-600">To create a simple and accessible learning resource that helps children build confidence while strengthening language and emotional awareness.</span>
                      </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                  >
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">Safe & Unsafe Touch Workshop</h4>
                      <p className="text-gray-600 mb-4">
                          An activity-based awareness workshop helping students understand the difference between safe and unsafe touch. It encourages recognizing boundaries, personal safety, and speaking up.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <span className="font-bold text-gray-900">Goal:</span> <span className="text-gray-600">To create safer learning environments by encouraging awareness, understanding, and open conversations around personal safety.</span>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>
{/* Active Mission & Projects */}
      {liveProjects.length > 0 && (
          <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="text-center mb-16">
                      <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Our Work</h2>
                      <h3 className="text-4xl font-bold mb-6">Active Mission & Projects</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                      {liveProjects.map(project => (
                          <div 
                              key={project._id || project.id} 
                              onClick={() => navigate(`/projects/${project._id || project.id}`)}
                              className="flex flex-col gap-4 group cursor-pointer"
                          >
                              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 relative">
                                  <img src={getImg(project)} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              </div>
                              <div className="flex items-start justify-between">
                                  <div>
                                      <h4 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">{project.title}</h4>
                                      <p className="text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                                  </div>
                                  <div className="shrink-0 ml-4 border border-gray-200 px-4 py-1 rounded-full text-sm font-bold text-gray-900">
                                      {project.date || new Date(project.createdAt || Date.now()).getFullYear()}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      )}

      {/* Publications & Reports */}
      {liveReports.length > 0 && (
          <section className="py-24 bg-gray-50 border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="text-center mb-16">
                      <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-2">Resources</h2>
                      <h3 className="text-4xl font-bold mb-6">Publications & Reports</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                      {liveReports.map(report => (
                          <div 
                              key={report._id || report.id} 
                              onClick={() => navigate(`/reports/${report._id || report.id}`)}
                              className="flex flex-col gap-4 group cursor-pointer"
                          >
                              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                  {report.image || report.url ? (
                                      <img src={getImg(report)} alt={report.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                  ) : (
                                      <div className="w-full h-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                                          <FileText size={48} className="text-secondary opacity-50 group-hover:scale-110 transition-transform duration-500" />
                                      </div>
                                  )}
                              </div>
                              <div className="flex items-start justify-between">
                                  <div>
                                      <h4 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-secondary transition-colors">{report.title}</h4>
                                      <p className="text-gray-500 mt-1 line-clamp-2">{report.description}</p>
                                  </div>
                                  <div className="shrink-0 ml-4 border border-gray-200 px-4 py-1 rounded-full text-sm font-bold text-gray-900">
                                      {report.date || new Date(report.createdAt || Date.now()).getFullYear()}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      )}



    </div>
  );
};

export default Impact;
