import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { ProductsListResponseDto } from './dto/products-list-response.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetProductsQueryDto): Promise<ProductsListResponseDto> {
    const { q, category, page = 1, limit = 10 } = query;

    // Build where clause with search and category filter
    const whereConditions: any[] = [];

    // Add search condition (search in name OR description)
    if (q) {
      whereConditions.push({
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      });
    }

    // Add category filter
    if (category) {
      whereConditions.push({ category });
    }

    // Build final where clause
    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    // Calculate pagination
    const skip = (page - 1) * limit;
    const take = limit;

    // Execute queries in parallel
    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Transform products to DTOs
    const data = products.map((product) =>
      ProductResponseDto.fromProduct(product),
    );

    return {
      data,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return ProductResponseDto.fromProduct(product);
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return categories.map((c) => c.category);
  }
}
