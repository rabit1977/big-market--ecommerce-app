import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

interface UseSearchNavigationProps {
  inputValue: string;
  selectedCategory?: string;
  selectedCity?: string;
  setIsSearchFocused: (focused: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const useSearchNavigation = ({
  inputValue,
  selectedCategory = 'all',
  selectedCity = 'all',
  setIsSearchFocused,
  inputRef,
}: UseSearchNavigationProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigateToSearchResults = useCallback(() => {
    if (inputValue.trim() || selectedCategory !== 'all' || selectedCity !== 'all') {
      startTransition(() => {
        const params = new URLSearchParams();
        if (inputValue.trim()) params.set('search', inputValue.trim());
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (selectedCity !== 'all') params.set('city', selectedCity);
        
        router.push(`/listings?${params.toString()}`);
        setIsSearchFocused(false);
        inputRef.current?.blur();
      });
    }
  }, [inputValue, selectedCategory, selectedCity, router, setIsSearchFocused, inputRef]);

  return { navigateToSearchResults, isPending };
};