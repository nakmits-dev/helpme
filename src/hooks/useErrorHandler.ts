import { useState, useCallback } from 'react';

interface ErrorState {
  message: string;
  code?: string;
  details?: unknown;
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState | null>(null);

  const handleError = useCallback((error: unknown) => {
    console.error('Error occurred:', error);

    if (error instanceof Error) {
      setError({
        message: error.message,
        code: (error as any).code,
        details: error
      });
    } else if (typeof error === 'string') {
      setError({ message: error });
    } else {
      setError({ message: 'エラーが発生しました。再度お試しください。' });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError
  };
}