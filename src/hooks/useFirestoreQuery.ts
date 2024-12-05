import { useState, useEffect } from 'react';
import { Query, DocumentData, getDocs } from 'firebase/firestore';

interface QueryState<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
}

export function useFirestoreQuery<T extends DocumentData>(query: Query<DocumentData>) {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(query);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error });
      }
    };

    fetchData();
  }, [query]);

  return state;
}