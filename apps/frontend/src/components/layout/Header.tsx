import { Link } from 'react-router-dom';

export function Header() {
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
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Catalog
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
