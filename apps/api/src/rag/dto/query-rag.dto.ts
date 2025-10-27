import { IsString, IsOptional, MinLength, IsObject } from 'class-validator';

/**
 * DTO for RAG query requests
 */
export class QueryRagDto {
  /**
   * The user's question or query
   * Must be at least 3 characters long
   */
  @IsString()
  @MinLength(3, { message: 'Query must be at least 3 characters long' })
  query: string;

  /**
   * Optional filters to apply to the search
   * Can include category filtering
   */
  @IsOptional()
  @IsObject()
  filters?: {
    category?: string;
  };
}
