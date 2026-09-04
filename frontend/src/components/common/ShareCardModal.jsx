import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, Download, MessageCircle, Twitter, Linkedin, ExternalLink } from 'lucide-react';

export default function ShareCardModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  // Use deployed production domain https://samikaran.org
  const shareUrl = typeof window !== 'undefined' && window.location.hostname.includes('samikaran.org')
    ? window.location.href
    : 'https://samikaran.org';
  const shareTitle = 'Samikaran - Social Initiative & NGO';
  const shareText = 'Empowering every individual to live with purpose, dignity, and opportunity. Discover Samikaran: ';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Share2 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Share Samikaran</h3>
                  <p className="text-xs text-gray-500 font-medium">Spread the word about our social mission</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Card Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Social Share Meta Card Preview</span>
                  <span className="text-[11px] font-medium text-gray-400">1200 × 630 px</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-200 group bg-gray-50">
                  <img
                    src="/og-image.png"
                    alt="Samikaran Share Card"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  <a
                    href="/og-image.png"
                    download="samikaran-og-card.png"
                    className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md border border-gray-200 transition-colors"
                  >
                    <Download size={14} className="text-primary" /> Download Card
                  </a>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Share Directly</span>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={shareWhatsApp}
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-sm transition-all border border-emerald-200/60"
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={shareTwitter}
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-sm transition-all"
                  >
                    <Twitter size={18} />
                    <span>X (Twitter)</span>
                  </button>
                  <button
                    onClick={shareLinkedIn}
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm transition-all border border-blue-200/60"
                  >
                    <Linkedin size={18} />
                    <span>LinkedIn</span>
                  </button>
                </div>
              </div>

              {/* Copy Link Input */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Or copy page link</span>
                <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-2xl">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-transparent px-3 text-sm text-gray-700 font-medium outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={14} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
