import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Hub = lazy(() => import('@/pages/intelligence/Hub'));

const IntelligenceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route path="/hub" element={<Hub />} />
    </Routes>
  );
};

export default IntelligenceRoutes;