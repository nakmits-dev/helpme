import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, LogOut, User } from 'lucide-react';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user || location.pathname === '/login') return null;

  return (
    <nav className="flex items-center space-x-2">
      <Link 
        to="/" 
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
          ${location.pathname === '/' 
            ? 'text-primary-600 bg-primary-50' 
            : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
          }`}
      >
        <Home className="h-5 w-5" />
        <span className="hidden sm:inline">ホーム</span>
      </Link>

      {!user.isAnonymous && (
        <Link 
          to="/profile" 
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
            ${location.pathname === '/profile'
              ? 'text-primary-600 bg-primary-50'
              : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
            }`}
        >
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">プロフィール</span>
        </Link>
      )}

      <button
        onClick={handleSignOut}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
      >
        <LogOut className="h-5 w-5" />
        <span className="hidden sm:inline">ログアウト</span>
      </button>
    </nav>
  );
}