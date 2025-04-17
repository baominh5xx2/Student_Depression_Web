import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ModelPredictPage from '../pages/modelpredictpage/modelpredictpage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/model-predict" element={<ModelPredictPage />} />
        <Route path="*" element={<Navigate to="/model-predict" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
