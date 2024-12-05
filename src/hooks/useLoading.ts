import { useState, useCallback, useRef, useEffect } from 'react';

interface UseLoadingOptions {
  delay?: number;
  minDuration?: number;
}

export function useLoading(options: UseLoadingOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const { delay = 200, minDuration = 500 } = options;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startLoading = useCallback(() => {
    setLoading(true);
    startTimeRef.current = Date.now();

    timeoutRef.current = setTimeout(() => {
      setShouldShow(true);
    }, delay);
  }, [delay]);

  const stopLoading = useCallback(() => {
    if (!startTimeRef.current) {
      setLoading(false);
      setShouldShow(false);
      return;
    }

    const elapsedTime = Date.now() - startTimeRef.current;
    const remainingTime = Math.max(0, minDuration - elapsedTime);

    setTimeout(() => {
      setLoading(false);
      setShouldShow(false);
      startTimeRef.current = null;
    }, remainingTime);
  }, [minDuration]);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    startLoading();
    try {
      return await fn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    shouldShow,
    startLoading,
    stopLoading,
    withLoading
  };
}