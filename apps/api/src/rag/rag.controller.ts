import { Controller } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  // Endpoint will be added in Phase 9:
  // - POST /rag/query (AI Q&A with citations)
}
