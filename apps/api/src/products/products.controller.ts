import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { ProductsListResponseDto } from './dto/products-list-response.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query() query: GetProductsQueryDto,
  ): Promise<ProductsListResponseDto> {
    return this.productsService.findAll(query);
  }

  @Get('categories/list')
  async getCategories(): Promise<string[]> {
    return this.productsService.getCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }
}
