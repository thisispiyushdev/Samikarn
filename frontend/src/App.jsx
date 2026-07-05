import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/common/SmoothScroll';

const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const ReportDetail = React.lazy(() => import('./pages/ReportDetail'));

const Impact = React.lazy(() => import('./pages/Impact'));
const Media = React.lazy(() => import('./pages/Media'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Donate = React.lazy(() => import('./pages/Donate'));
const AdminApp = React.lazy(() => import('./admin/AdminApp'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <Layout>
      <SmoothScroll />
      <CustomCursor />
      <ScrollToTop />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/reports/:id" element={<ReportDetail />} />

          <Route path="/impact" element={<Impact />} />
          <Route path="/media" element={<Media />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donate/:programId" element={<Donate />} />
          <Route path="/admin/*" element={<AdminApp />} />
          
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-[60vh] flex-col">
              <h1 className="text-4xl font-bold text-gray-300">404</h1>
              <p className="text-gray-500 mt-2">Page Not Found</p>
            </div>
          } />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
