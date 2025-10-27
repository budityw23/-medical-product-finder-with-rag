import { api } from './api';

/**
 * Source citation for RAG responses
 */
export interface RagSource {
  title: string;
  snippet: string;
  productId?: string;
  score?: number;
}

/**
 * RAG query request
 */
export interface RagQueryRequest {
  query: string;
  filters?: {
    category?: string;
  };
}

/**
 * RAG query response
 */
export interface RagQueryResponse {
  answer: string;
  sources: RagSource[];
  metadata?: {
    chunksRetrieved?: number;
    embeddingModel?: string;
    completionModel?: string;
  };
}

/**
 * RAG API client
 */
export const ragApi = {
  /**
   * Query the RAG system with a user question
   *
   * @param request - The query request with question and optional filters
   * @returns RAG response with answer and citations
   */
  query: async (request: RagQueryRequest): Promise<RagQueryResponse> => {
    return api.post<RagQueryResponse>('/rag/query', request);
  },
};
