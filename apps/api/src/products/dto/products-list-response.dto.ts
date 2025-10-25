import { ProductResponseDto } from './product-response.dto';

export class ProductsListResponseDto {
  data: ProductResponseDto[];
  totalCount: number;
  page: number;
  limit: number;
}
