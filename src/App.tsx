import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/dashboard/Home';
import NetworkViewWrapper from './pages/dashboard/NetworkViewWrapper';
import Referrals from './pages/dashboard/Referrals';
import Profile from './pages/dashboard/Profile';

// Temporary auth mock hook
export const useAuth = () => {
  const token = localStorage.getItem('mmn_token');
  return { isAuthenticated: !!token };
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="network" element={<NetworkViewWrapper />} />
          <Route path="referrals" element={<Referrals />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
