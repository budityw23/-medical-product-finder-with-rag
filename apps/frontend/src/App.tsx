import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { CatalogPage, ProductDetailPage, RagPage, NotFoundPage } from '@/routes';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/ask" element={<RagPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
