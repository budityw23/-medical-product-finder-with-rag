import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function CatalogPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts({}),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Medical Product Catalog</h1>
        <p className="text-muted-foreground">
          Browse our comprehensive collection of medical devices and equipment
        </p>
      </div>

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

      {data && <ProductGrid products={data.data} />}
    </div>
  );
}
