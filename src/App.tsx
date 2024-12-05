import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';
import Thread from './pages/Thread';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EmailVerification from './pages/EmailVerification';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';

function AuthRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* パブリックルート */}
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <Login />
        } />
        <Route path="/verify-email" element={<EmailVerification />} />
        
        {/* 保護されたルート */}
        <Route index element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/thread/:threadId" element={
          <ProtectedRoute>
            <Thread />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* 不明なURLはすべてホームページにリダイレクト */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthRouter />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;