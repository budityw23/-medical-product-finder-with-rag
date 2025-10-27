/**
 * Source citation for RAG responses
 */
export class SourceDto {
  /**
   * Title of the source document
   */
  title: string;

  /**
   * Relevant snippet or excerpt from the source
   */
  snippet: string;

  /**
   * Optional product ID if the source is related to a product
   */
  productId?: string;

  /**
   * Similarity score (0-1, where 1 is most similar)
   */
  score?: number;
}

/**
 * DTO for RAG query responses
 */
export class RagResponseDto {
  /**
   * The AI-generated answer to the user's query
   */
  answer: string;

  /**
   * Array of source citations that were used to generate the answer
   */
  sources: SourceDto[];

  /**
   * Optional metadata about the query processing
   */
  metadata?: {
    /**
     * Number of chunks retrieved
     */
    chunksRetrieved?: number;

    /**
     * Model used for embeddings
     */
    embeddingModel?: string;

    /**
     * Model used for completion
     */
    completionModel?: string;
  };
}
