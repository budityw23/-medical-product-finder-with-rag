import { Link, useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Medical Product Finder</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/" && "text-primary"
              )}
            >
              Catalog
            </Link>
            <Link
              to="/ask"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                location.pathname === "/ask" && "text-primary"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              Ask AI
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
