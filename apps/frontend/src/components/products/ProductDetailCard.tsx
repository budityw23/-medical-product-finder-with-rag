import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface ProductDetailCardProps {
  product: Product;
}

export function ProductDetailCard({ product }: ProductDetailCardProps) {
  const navigate = useNavigate();

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

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{product.name}</CardTitle>
              <CardDescription className="text-base">
                Manufactured by {product.manufacturer}
              </CardDescription>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {product.category}
              </Badge>
              <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Product ID</p>
                <p className="font-mono text-sm">{product.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                <p>{product.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Manufacturer</p>
                <p>{product.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Price</p>
                <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
