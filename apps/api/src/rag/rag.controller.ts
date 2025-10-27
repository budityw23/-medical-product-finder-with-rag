import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RagService } from './rag.service';
import { QueryRagDto, RagResponseDto } from './dto';

/**
 * RAG Controller - Handles AI Q&A endpoints
 */
@Controller('rag')
export class RagController {
  private readonly logger = new Logger(RagController.name);

  constructor(private readonly ragService: RagService) {}

  /**
   * POST /rag/query
   *
   * Process a user query and return an AI-generated answer with source citations
   *
   * @param queryDto - The query request containing the user's question and optional filters
   * @returns RAG response with answer and citations
   */
  @Post('query')
  async query(@Body() queryDto: QueryRagDto): Promise<RagResponseDto> {
    try {
      this.logger.log(`RAG query received: "${queryDto.query}"`);

      // Process the query using the RAG service
      const response = await this.ragService.query(
        queryDto.query,
        queryDto.filters,
      );

      return response;
    } catch (error: any) {
      this.logger.error('Error processing RAG query:', error);

      // Return appropriate error response
      if (error.message?.includes('OPENAI_API_KEY')) {
        throw new HttpException(
          'OpenAI API is not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Failed to process query. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
