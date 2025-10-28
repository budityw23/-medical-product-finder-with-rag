import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import { FilterBar } from '@/components/products/FilterBar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { useProductFilters } from '@/hooks';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CatalogPage() {
  const {
    q,
    category,
    searchInput,
    setSearchInput,
    setCategory,
    clearFilters,
    hasActiveFilters,
  } = useProductFilters();

  const [page, setPage] = useState(1);
  const limit = 10;

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [q, category]);

  // Convert 'all' to undefined for API
  const apiCategory = category === 'all' ? undefined : category;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', { q, category: apiCategory, page, limit }],
    queryFn: () => productsApi.getProducts({ q, category: apiCategory, page, limit }),
  });

  const hasNoResults = !isLoading && data?.data.length === 0;
  const totalPages = data ? Math.ceil(data.totalCount / limit) : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Medical Product Catalog</h1>
        <p className="text-muted-foreground">
          Browse our comprehensive collection of medical devices and equipment
        </p>
      </div>

      <FilterBar
        searchValue={searchInput}
        categoryValue={category}
        onSearchChange={setSearchInput}
        onCategoryChange={setCategory}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {isLoading && <ProductGridSkeleton />}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load products. Please try again later.'}
          </AlertDescription>
        </Alert>
      )}

      {hasNoResults && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No products found</AlertTitle>
          <AlertDescription>
            No products match your current filters. Try adjusting your search criteria or clear all filters to see all products.
          </AlertDescription>
        </Alert>
      )}

      {data && data.data.length > 0 && (
        <>
          <ProductGrid products={data.data} />

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({data.totalCount} products)
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
