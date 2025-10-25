export class ProductResponseDto {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  price: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;

  static fromProduct(product: any): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      manufacturer: product.manufacturer,
      price: product.price.toNumber ? product.price.toNumber() : Number(product.price),
      description: product.description,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
