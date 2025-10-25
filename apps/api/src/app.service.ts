import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  service: string;
  version: string;
  database: {
    status: 'connected' | 'disconnected';
    message?: string;
  };
}

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Medical Product Finder API - Ready';
  }

  async getHealth(): Promise<HealthResponse> {
    const healthResponse: HealthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'medical-product-finder-api',
      version: '1.0.0',
      database: {
        status: 'disconnected',
      },
    };

    try {
      // Test database connection with a simple query
      await this.prisma.$queryRaw`SELECT 1`;
      healthResponse.database.status = 'connected';
    } catch (error) {
      healthResponse.status = 'error';
      healthResponse.database.status = 'disconnected';
      healthResponse.database.message = error.message || 'Database connection failed';
    }

    return healthResponse;
  }
}
