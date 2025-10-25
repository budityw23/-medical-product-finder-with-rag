import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Go to Catalog</Link>
      </Button>
    </div>
  );
}
