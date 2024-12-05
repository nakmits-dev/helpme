import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export function useAppNavigation() {
  const navigate = useNavigate();

  const goToHome = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  const goToThread = useCallback((threadId: string) => {
    navigate(`/thread/${threadId}`);
  }, [navigate]);

  const goToLogin = useCallback((from?: string) => {
    navigate('/login', { state: { from }, replace: true });
  }, [navigate]);

  const goToProfile = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  return {
    goToHome,
    goToThread,
    goToLogin,
    goToProfile
  };
}