import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  LayoutDashboard, 
  FolderHeart, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  Bell,
  Search,
  UserPlus,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MoreVertical,
  Calendar,
  Image as ImageIcon,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  Newspaper,
  TrendingUp,
  X,
  Menu,
  UserCheck,
  Send,
  Eye,
  Edit3,
  FileText,
  Megaphone,
  LayoutTemplate,
  MessageSquare
} from 'lucide-react';
import { convertDriveLinkToDirect } from '../utils/googleDriveParser';
import logo from '../assets/media/1.png.png';

const apiBase = import.meta.env.VITE_API_BASE_URL || '';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- DECORATIVE & UI COMPONENTS ---
const GridBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(249,250,251,0.9)_100%)]" />
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.2] stroke-gray-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid-pattern"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
            x="50%"
            y="-1"
          >
            <path d="M.5 32V.5H32" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
};

const SpotlightCard = ({ children, className, title, subtitle, delay = 0 }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden group/spotlight",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.06), transparent 80%)`
          ),
        }}
      />
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-wider">{subtitle}</p>}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const PremiumInput = ({ label, icon: Icon, type = 'text', ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2 w-full">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest transition-colors duration-200">
        {label}
      </label>
      <div
        className={cn(
          "relative flex items-center rounded-xl bg-gray-50/50 border transition-all duration-200",
          isFocused 
            ? "border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)]" 
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        {Icon && (
          <div className="pl-4 flex items-center justify-center text-gray-400">
            <Icon size={18} className={cn("transition-colors duration-200", isFocused && "text-indigo-500")} />
          </div>
        )}
        <input
          type={type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full bg-transparent px-4 py-3.5 text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400 placeholder:font-normal",
            Icon && "pl-3"
          )}
          {...props}
        />
      </div>
    </div>
  );
};

const PremiumSelect = ({ label, icon: Icon, options = [], ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2 w-full">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest transition-colors duration-200">
        {label}
      </label>
      <div
        className={cn(
          "relative flex items-center rounded-xl bg-gray-50/50 border transition-all duration-200",
          isFocused 
            ? "border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)]" 
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        {Icon && (
          <div className="pl-4 flex items-center justify-center text-gray-400">
            <Icon size={18} className={cn("transition-colors duration-200", isFocused && "text-indigo-500")} />
          </div>
        )}
        <select
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full bg-transparent px-4 py-3.5 text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400 appearance-none",
            Icon && "pl-3"
          )}
          {...props}
        >
          <option value="" disabled>Select category...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
};

const ShinyButton = ({ 
  children, 
  className, 
  loading, 
  icon: Icon, 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyles = "relative flex items-center justify-center gap-2 rounded-xl font-bold text-sm tracking-wider transition-all duration-300 overflow-hidden select-none px-6 py-3.5 shadow-sm active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md border border-indigo-600",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
    danger: "bg-red-600 hover:bg-red-700 text-white hover:shadow-lg hover:shadow-red-600/10 border border-red-600",
  };

  return (
    
        
      </div>
      
{activeTab === 'hero' ? (
        <CarouselManager showToast={showToast} />
      ) : null}
    </div>
  );
};

const AdminApp = () => {
  const auth = useAuth();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  if (!auth.token) {
    return (
      <div className="font-sans selection:bg-gray-900 selection:text-white">
        <AnimatePresence>
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </AnimatePresence>
        <Routes>
          <Route path="/bootstrap" element={<Bootstrap />} />
          <Route path="*" element={<Login onLogin={auth.login} />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="font-sans selection:bg-gray-900 selection:text-white">
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
      <AdminLayout onLogout={auth.logout} showToast={showToast} />
    </div>
  );
};

export default AdminApp;
