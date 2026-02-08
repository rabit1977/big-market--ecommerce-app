import { Listing } from './listing';

export interface SearchState {
  inputValue: string;
  isSearchFocused: boolean;
  searchResults: Listing[];
  isLoading: boolean;
}

export interface SearchResultItem {
  product: Listing;
  index: number;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => void;
}
