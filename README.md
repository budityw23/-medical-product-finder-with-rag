# Medical Product Finder with RAG

A smart medical product catalog with AI-powered search using Retrieval-Augmented Generation (RAG). This project demonstrates a modern full-stack application with NestJS, React, PostgreSQL with pgvector, and OpenAI integration.

## Tech Stack

### Frontend
- React 18 + Vite + TypeScript
- TailwindCSS + shadcn/ui
- React Query for state management
- React Router for navigation

### Backend
- NestJS + TypeScript
- Prisma ORM
- OpenAI API (embeddings + chat completions)
- Class-validator for validation

### Database
- PostgreSQL 16
- pgvector extension for vector similarity search

### Infrastructure
- Docker + Docker Compose
- npm workspaces (monorepo)

## Project Structure

```
.
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── frontend/               # React frontend
│       ├── src/
│       ├── Dockerfile
│       ├── nginx.conf
│       └── package.json
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Migration files
│   └── init-extensions.sql    # pgvector setup
├── scripts/
│   ├── seed.ts                # Seed sample products
│   └── ingest.ts              # Generate and store embeddings
├── infra/
│   └── docker-compose.yml     # Local development setup
├── docs/                      # Documentation
├── .env.example               # Environment variables template
├── package.json               # Root workspace config
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker and Docker Compose
- OpenAI API key (for RAG features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medical-product-finder-with-rag
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=medical_finder
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medical_finder?schema=public

NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

OPENAI_API_KEY=sk-your-openai-api-key-here

VITE_API_BASE_URL=http://localhost:3000
```

4. Install dependencies:
```bash
npm install
```

### Development with Docker Compose

Start all services (database, API, frontend):

```bash
npm run docker:up
```

This will start:
- PostgreSQL with pgvector on `localhost:5432`
- NestJS API on `localhost:3000`
- React frontend on `localhost:5173`

Stop all services:
```bash
npm run docker:down
```

### Development without Docker

1. Start PostgreSQL with pgvector (ensure it's running on port 5432)

2. Generate Prisma Client:
```bash
npm run prisma:generate
```

3. Run database migrations:
```bash
npm run prisma:migrate:dev
```

4. Start the API in development mode:
```bash
npm run dev:api
```

5. In another terminal, start the frontend:
```bash
npm run dev:frontend
```

### Database Setup

1. The pgvector extension is automatically enabled via `init-extensions.sql`

2. Run migrations to create tables:
```bash
npm run prisma:migrate:dev
```

3. (Phase 3) Seed sample data:
```bash
npm run seed
```

4. (Phase 9) Generate embeddings:
```bash
npm run ingest
```

## Available Scripts

### Root workspace scripts:
- `npm run dev` - Start both API and frontend in development mode
- `npm run dev:api` - Start only the API
- `npm run dev:frontend` - Start only the frontend
- `npm run build` - Build both applications
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate:dev` - Run migrations in development
- `npm run prisma:migrate:deploy` - Run migrations in production
- `npm run seed` - Seed database with sample data
- `npm run ingest` - Generate and store vector embeddings
- `npm run docker:up` - Start Docker Compose services
- `npm run docker:down` - Stop Docker Compose services
- `npm run docker:build` - Rebuild Docker images

## API Endpoints

Once Phase 4+ is complete:

- `GET /health` - Health check
- `GET /products` - List products (with search & filter)
- `GET /products/:id` - Get product details
- `POST /rag/query` - Ask AI questions about products

## Development Phases

This project follows a 10-phase implementation strategy:

- [x] **Phase 1**: Project Initialization and Environment Setup
- [ ] **Phase 2**: Database Design and Schema Implementation
- [ ] **Phase 3**: Data Seeding and Ingestion Preparation
- [ ] **Phase 4**: Backend API Foundation
- [ ] **Phase 5**: Product Management API
- [ ] **Phase 6**: Frontend Setup and UI Framework
- [ ] **Phase 7**: Product Catalog and Details UI
- [ ] **Phase 8**: Search and Filtering Features
- [ ] **Phase 9**: RAG Pipeline Implementation
- [ ] **Phase 10**: Deployment, CI/CD, and Final Polish

See `docs/technical-implementation-strategy.md` for detailed phase descriptions.

## Testing

After Phase 1, verify the setup:

1. Check if all services are running:
```bash
docker compose -f infra/docker-compose.yml ps
```

2. Test the API health endpoint:
```bash
curl http://localhost:3000/health
```

3. Open the frontend in your browser:
```
http://localhost:5173
```

4. Check database connection:
```bash
docker compose -f infra/docker-compose.yml exec db psql -U postgres -d medical_finder -c "\dx"
```
You should see the `vector` extension listed.

## Architecture

The application follows clean architecture principles:

- **Frontend**: Component-based React with Tailwind for styling
- **Backend**: Modular NestJS with separation of concerns (controllers, services, DTOs)
- **Database**: Prisma ORM with type-safe queries
- **RAG Pipeline**: OpenAI embeddings stored in pgvector for semantic search

## Contributing

This is a portfolio project. See `docs/implementation-checklist.md` for development progress.

## License

MIT

## Acknowledgments

Built following clean code principles (SOLID, DRY, SoC) with modern TypeScript best practices.
