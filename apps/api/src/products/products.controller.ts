import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Endpoints will be added in Phase 5:
  // - GET /products (paginated list with search and filters)
  // - GET /products/:id (product detail)
}
