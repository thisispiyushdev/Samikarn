import React, { useEffect, useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Mailbox, Youtube, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cachedFetch } from '../../utils/cachedFetch';

const Footer = () => {
  const [settings, setSettings] = useState({ address:'', phone:'', email:'', socials: {} });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  useEffect(()=>{
    cachedFetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/settings`)
      .then(r=>r.json())
      .then(d=>{ if (d.success) setSettings(d.settings); })
      .catch(()=>{});
  },[]);

  // Prepare social links array
  const socials = settings.socials || {};
  const socialLinks = [
    { icon: Facebook, url: socials.facebook },
    { icon: Instagram, url: socials.instagram },
    { icon: Linkedin, url: socials.linkedin },
    { icon: Twitter, url: socials.twitter },
    { icon: Youtube, url: socials.youtube },
    { icon: MessageCircle, url: socials.whatsapp },
  ].filter(s => s.url);

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t-4 border-secondary">
        <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div>
                    <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">SAMIKARAN</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        Empowering communities and creating sustainable change through education, livelihood and health.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                        {socialLinks.map((social, i) => (
                            <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" aria-label="Social media link" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white hover:scale-110 transform">
                                <social.icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>
                
                <div>
                    <h4 className="text-lg font-semibold mb-6 border-b-2 border-primary inline-block pb-2">Quick Links</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link to="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
                        <li><Link to="/media" className="hover:text-secondary transition-colors">Media Presence</Link></li>
                        <li><Link to="/impact" className="hover:text-secondary transition-colors">Impact & Projects</Link></li>
                        <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
                        <li><Link to="/donate" className="hover:text-secondary transition-colors font-bold text-primary">Donate</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-6 border-b-2 border-primary inline-block pb-2">Contact Info</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex gap-3 items-start">
                            <Mailbox className="mt-1 shrink-0 text-primary" size={20} />
                            <span>{settings.address || '—'}</span>
                        </li>
                        <li className="flex gap-3 items-center">
                            <Phone className="shrink-0 text-primary" size={20} />
                            <span>{settings.phone || '—'}</span>
                        </li>
                        <li className="flex gap-3 items-center">
                            <Mail className="shrink-0 text-primary" size={20} />
                            <span>{settings.email || '—'}</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-6 border-b-2 border-primary inline-block pb-2">Newsletter</h4>
                    <p className="text-gray-400 mb-4">Subscribe to our newsletter for latest updates.</p>
                    <form className="flex flex-col gap-3" onSubmit={async (e) => {
                        e.preventDefault();
                        const email = e.target.email.value;
                        if (!email) return;

                        try {
                            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/subscribers`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email }),
                            });

                            const data = await response.json();

                            if (data.success) {
                                showToast(data.message, 'success');
                                e.target.reset();
                            } else {
                                showToast(data.message, 'error');
                            }
                        } catch (error) {
                            console.error('Subscription error:', error);
                            showToast('Something went wrong. Please try again later.', 'error');
                        }
                    }}>
                        <input name="email" type="email" placeholder="Your Email" className="bg-gray-800 border-none rounded-lg p-3 focus:ring-2 focus:ring-primary text-white outline-none" required />
                        <button type="submit" className="bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors shadow-lg">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} SAMIKARAN. All rights reserved.</p>
            </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
            {toast.show && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-2xl min-w-[320px] text-white"
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                        {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{toast.message}</p>
                    </div>
                    <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    </footer>
  );
};

export default Footer;
