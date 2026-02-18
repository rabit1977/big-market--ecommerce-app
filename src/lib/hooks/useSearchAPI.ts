import { Listing } from '@/lib/types';
import { useDeferredValue, useEffect, useRef } from 'react';

interface UseSearchAPIProps {
  query: string;
  setResults: (results: Listing[]) => void;
  setIsLoading: (loading: boolean) => void;
  minQueryLength?: number;
  maxResults?: number;
}

export const useSearchAPI = ({
  query,
  setResults,
  setIsLoading,
  minQueryLength = 2,
  maxResults = 5,
}: UseSearchAPIProps) => {
  const deferredQuery = useDeferredValue(query);

  // Refs so the effect never needs setResults/setIsLoading in its dep array
  const setResultsRef = useRef(setResults);
  const setIsLoadingRef = useRef(setIsLoading);
  useEffect(() => { setResultsRef.current = setResults; }, [setResults]);
  useEffect(() => { setIsLoadingRef.current = setIsLoading; }, [setIsLoading]);

  useEffect(() => {
    if (deferredQuery.length < minQueryLength) {
      setResultsRef.current([]);
      setIsLoadingRef.current(false);
      return;
    }

    const controller = new AbortController();
    setIsLoadingRef.current(true);

    const fetchResults = async () => {
      try {
        const response = await fetch(
          `/api/listings/search?query=${encodeURIComponent(deferredQuery)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error('Search failed');
        const results = await response.json();
        setResultsRef.current(results.slice(0, maxResults));
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        setResultsRef.current([]);
      } finally {
        setIsLoadingRef.current(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [deferredQuery, minQueryLength, maxResults]);
};