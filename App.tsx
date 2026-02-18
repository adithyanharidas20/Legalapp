
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdvocateDashboard from './pages/AdvocateDashboard';
import AdvocateCases from './pages/AdvocateCases';
import AdvocateAIAssistant from './pages/AdvocateAIAssistant';
import ClientDashboard from './pages/ClientDashboard';
import ClientFindAdvocate from './pages/ClientFindAdvocate';
import ClientCases from './pages/ClientCases';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-client" element={<Navigate to="/register" />} />
        <Route path="/register-advocate" element={<Navigate to="/register" />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Advocate Routes */}
        <Route path="/advocate" element={<AdvocateDashboard />} />
        <Route path="/advocate/cases" element={<AdvocateCases />} />
        <Route path="/advocate/ai" element={<AdvocateAIAssistant />} />
        
        {/* Client Routes */}
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/search" element={<ClientFindAdvocate />} />
        <Route path="/client/cases" element={<ClientCases />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
