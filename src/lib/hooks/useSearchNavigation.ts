import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

interface UseSearchNavigationProps {
  inputValue: string;
  selectedCategory?: string;
  setIsSearchFocused: (focused: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const useSearchNavigation = ({
  inputValue,
  selectedCategory = 'all',
  setIsSearchFocused,
  inputRef,
}: UseSearchNavigationProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigateToSearchResults = useCallback(() => {
    if (inputValue.trim() || selectedCategory !== 'all') {
      startTransition(() => {
        const params = new URLSearchParams();
        if (inputValue.trim()) params.set('search', inputValue.trim());
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        
        router.push(`/listings?${params.toString()}`);
        setIsSearchFocused(false);
        inputRef.current?.blur();
      });
    }
  }, [inputValue, selectedCategory, router, setIsSearchFocused, inputRef]);

  return { navigateToSearchResults, isPending };
};