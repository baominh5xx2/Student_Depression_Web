import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ModelPredictPage from '../pages/modelpredictpage/modelpredictpage';
import HistoryPage from '../pages/historypage/historypage';
import NotFoundPage from '../pages/notfoundpage/notfoundpage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/model-predict" element={<ModelPredictPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="/" element={<Navigate to="/model-predict" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
