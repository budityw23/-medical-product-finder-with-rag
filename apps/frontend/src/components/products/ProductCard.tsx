import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { formatPrice, truncateText } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="block h-full">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {product.category}
            </Badge>
          </div>
          <CardDescription>{product.manufacturer}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <p className="text-sm text-muted-foreground mb-4">
            {truncateText(product.description, 100)}
          </p>
          <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
