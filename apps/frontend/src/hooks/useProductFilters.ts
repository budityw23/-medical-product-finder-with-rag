import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/lib/utils';

export interface ProductFilters {
  q: string;
  category: string;
  searchInput: string;
  debouncedSearch: string;
  setSearchInput: (value: string) => void;
  setCategory: (value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function useProductFilters(): ProductFilters {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 300);

  // Update URL when debounced search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearch) {
      params.set('q', debouncedSearch);
    } else {
      params.delete('q');
    }

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, setSearchParams]);

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    setSearchParams(params, { replace: true });
  }, [category, setSearchParams]);

  // Sync state with URL params on initial load
  useEffect(() => {
    const urlSearch = searchParams.get('q') || '';
    const urlCategory = searchParams.get('category') || 'all';

    if (urlSearch !== searchInput) {
      setSearchInput(urlSearch);
    }
    if (urlCategory !== category) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  const clearFilters = () => {
    setSearchInput('');
    setCategory('all');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = useMemo(() => {
    return !!debouncedSearch || (!!category && category !== 'all');
  }, [debouncedSearch, category]);

  return {
    q: debouncedSearch,
    category,
    searchInput,
    debouncedSearch,
    setSearchInput,
    setCategory,
    clearFilters,
    hasActiveFilters,
  };
}
