import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { ProductDetailCard } from '@/components/products/ProductDetailCard';
import { ProductDetailSkeleton } from '@/components/products/ProductDetailSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProductById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load product details.';
    const is404 = errorMessage.toLowerCase().includes('not found') ||
                  (error as any)?.statusCode === 404;

    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{is404 ? 'Product Not Found' : 'Error'}</AlertTitle>
          <AlertDescription>
            {is404
              ? `Product with ID "${id}" was not found. It may have been removed or the link may be invalid.`
              : errorMessage
            }
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return <ProductDetailCard product={product} />;
}
