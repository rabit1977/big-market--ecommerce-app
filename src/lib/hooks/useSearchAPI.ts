import { Listing } from '@/lib/types';
import { useDeferredValue, useEffect } from 'react';

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

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (deferredQuery.length < minQueryLength) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/listings/search?query=${encodeURIComponent(deferredQuery)}`
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const results = await response.json();
        setResults(results.slice(0, maxResults));
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [deferredQuery, setResults, setIsLoading, minQueryLength, maxResults]);
};