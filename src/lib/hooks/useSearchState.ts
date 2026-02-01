import { Listing } from '@/lib/types';
import { useCallback, useState } from 'react';

export const useSearchState = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const clearSearch = useCallback(() => {
    setInputValue('');
    setSearchResults([]);
  }, []);

  const resetSearch = useCallback(() => {
    setInputValue('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setSearchResults([]);
    setIsSearchFocused(false);
  }, []);

  return {
    inputValue,
    setInputValue,
    selectedCategory,
    setSelectedCategory,
    selectedCity,
    setSelectedCity,
    isSearchFocused,
    setIsSearchFocused,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    clearSearch,
    resetSearch,
  };
};