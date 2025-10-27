# Medical Product Finder with RAG

A smart medical product catalog with AI-powered search using Retrieval-Augmented Generation (RAG). Browse 20 medical devices across 5 categories with intelligent search capabilities powered by OpenAI embeddings and pgvector.

**Live Demo**: Browse products at `http://localhost:5173` after setup.

## ✨ Features

- 🏥 **Product Catalog**: Browse 20 medical devices (Cardiology, Orthopedic, Neurology, Imaging, Surgical)
- 🔍 **Search & Filter**: Real-time search with debouncing and category filtering with URL state management
- 🤖 **AI-Powered Q&A**: Ask natural language questions about products with RAG using OpenAI embeddings and pgvector
- 📱 **Responsive Design**: Mobile-first UI with shadcn/ui components
- ⚡ **Fast & Cached**: React Query for optimized data fetching
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS
- 🎯 **Vector Search**: Semantic similarity search using OpenAI embeddings (1536 dimensions)
- 📚 **Source Citations**: AI answers include product citations with similarity scores

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** and **npm 10+**
- **Docker** and **Docker Compose**
- **OpenAI API key** (for RAG features in Phase 9)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd medical-product-finder-with-rag

# 2. Copy environment variables
cp .env.example .env

# 3. Add your OpenAI API key to .env
# OPENAI_API_KEY=sk-your-key-here

# 4. Install dependencies
npm install

# 5. Start all services with Docker
npm run docker:up

# 6. Seed sample data (20 medical products)
npm run seed

# 7. Generate embeddings for RAG (requires OpenAI API key)
npm run ingest
```

### Access the Application

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health
- **Database**: localhost:5432
- **Ask AI (RAG)**: http://localhost:5173/ask

## 📦 Tech Stack

### Frontend
- **React 18** with **Vite** - Lightning-fast dev server
- **TypeScript** - Type safety throughout
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **React Query** - Server state management
- **React Router** - Client-side routing

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma ORM** - Type-safe database client
- **OpenAI API** - Embeddings + chat completions
- **Class-validator** - DTO validation

### Database
- **PostgreSQL 16** - Robust relational database
- **pgvector** - Vector similarity search for RAG

### Infrastructure
- **Docker Compose** - Local development orchestration
- **npm Workspaces** - Monorepo management

## 🗂️ Project Structure

```
medical-product-finder-with-rag/
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── common/              # Shared modules (filters, pipes)
│   │   │   ├── prisma/              # Database service
│   │   │   ├── products/            # Product management
│   │   │   ├── rag/                 # RAG functionality
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   └── frontend/                     # React Frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/              # shadcn/ui components
│       │   │   ├── layout/          # Layout components
│       │   │   └── products/        # Product components
│       │   ├── routes/              # Page components
│       │   ├── lib/                 # API client, utilities
│       │   ├── types/               # TypeScript types
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── Dockerfile
│       └── package.json
├── prisma/
│   ├── schema.prisma                # Database models
│   ├── migrations/                  # Migration history
│   └── init-extensions.sql          # pgvector setup
├── scripts/
│   ├── seed.ts                      # Seed 20 sample products
│   └── ingest.ts                    # Generate embeddings (Phase 9)
├── infra/
│   └── docker-compose.yml           # Docker services
├── .env.example                     # Environment template
├── package.json                     # Workspace config
└── README.md
```

## 🔧 Available Scripts

### Development
```bash
npm run docker:up              # Start all services (recommended)
npm run docker:down            # Stop all services
npm run docker:build           # Rebuild Docker images

npm run dev:api                # Start API only (requires local PostgreSQL)
npm run dev:frontend           # Start frontend only
```

### Database
```bash
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate:dev     # Run migrations
npm run seed                   # Seed sample data
npm run seed:clear             # Clear and reseed data
npm run ingest                 # Generate embeddings (requires OpenAI)
npm run ingest:force           # Force regenerate all embeddings
npm run ingest:mock            # Generate mock embeddings (testing only)
```

### Build & Deploy
```bash
npm run build                  # Build both apps
npm run build:api              # Build API only
npm run build:frontend         # Build frontend only
```

## 🌐 API Endpoints

### Product Management
- `GET /health` - Health check with database status
- `GET /products` - List products (pagination, search, filter)
  - Query params: `?q=keyword&category=Cardiology&page=1&limit=10`
- `GET /products/:id` - Get single product details

### RAG (Retrieval-Augmented Generation)
- `POST /rag/query` - Ask AI questions about products
  - Body: `{ "query": "What orthopedic products are under $500?" }`
  - Response: AI-generated answer with product citations and similarity scores
  - Example:
    ```json
    {
      "answer": "Based on the provided information, the FlexiSupport Ankle Brace Pro is an orthopedic product under $500...",
      "sources": [
        {
          "title": "FlexiSupport Ankle Brace Pro User Manual",
          "snippet": "The FlexiSupport Ankle Brace Pro is a semi-rigid orthopedic support device...",
          "productId": "cmh6a1gg...",
          "score": 0.487
        }
      ],
      "metadata": {
        "chunksRetrieved": 5,
        "embeddingModel": "text-embedding-3-small",
        "completionModel": "gpt-3.5-turbo"
      }
    }
    ```

## 🎯 Implementation Progress

### ✅ Completed Phases (1-9)

- [x] **Phase 1**: Project setup, Docker Compose, monorepo structure
- [x] **Phase 2**: Database schema with pgvector, Prisma migrations
- [x] **Phase 3**: Seed 20 medical products across 5 categories
- [x] **Phase 4**: NestJS backend foundation with modules
- [x] **Phase 5**: Product API endpoints with validation
- [x] **Phase 6**: React frontend with shadcn/ui and React Query
- [x] **Phase 7**: Product catalog and detail pages with responsive UI
- [x] **Phase 8**: Search bar with debouncing, category filtering, URL state management
- [x] **Phase 9**: RAG pipeline with OpenAI embeddings and pgvector similarity search

### 🚧 Upcoming Phases (10)

- [ ] **Phase 10**: AWS deployment with CI/CD (optional)

## 🧪 Testing

### Verify Setup

```bash
# 1. Check all services are running
docker compose -f infra/docker-compose.yml ps

# 2. Test API health
curl http://localhost:3000/health

# 3. Test product list
curl http://localhost:3000/products

# 4. Verify pgvector extension
docker exec medical-finder-db psql -U postgres -d medical_finder -c "\dx"
```

### Test the Frontend

1. Open http://localhost:5173
2. Browse the product catalog (20 products in grid layout)
3. Use the search bar to find products (e.g., "stent", "knee")
4. Filter by category using the dropdown
5. Click any product to view details
6. Try the "Ask AI" feature at http://localhost:5173/ask

### Sample API Calls

```bash
# Get all products (paginated)
curl http://localhost:3000/products

# Search for "stent"
curl "http://localhost:3000/products?q=stent"

# Filter by Cardiology category
curl "http://localhost:3000/products?category=Cardiology"

# Get specific product
curl http://localhost:3000/products/<product-id>

# Ask AI about products (RAG)
curl -X POST http://localhost:3000/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Tell me about cardiology devices"}'

# Ask with category filter
curl -X POST http://localhost:3000/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What orthopedic products are under $500?", "category": "Orthopedic"}'
```

## 📊 Sample Data

The application includes 20 seeded medical products:

**Categories:**
- **Cardiology** (4): Stents, pacemakers, ECG systems, ventricular assist devices
- **Orthopedic** (4): Knee replacements, ankle braces, spinal cages, intramedullary nails
- **Neurology** (4): EEG systems, deep brain stimulators, cognitive tests, nerve conduction systems
- **Imaging** (4): MRI coils, ultrasound systems, mammography, C-arm fluoroscopy
- **Surgical** (4): Robotic systems, electrosurgical generators, scalpels, arthroscopy cameras

**Price Range:** $189 (ankle brace) to $1,250,000 (surgical robot)

## 🏗️ Architecture

### Clean Architecture Principles

- **Separation of Concerns**: Controllers → Services → Repositories
- **SOLID Principles**: Single responsibility, dependency injection
- **DRY**: Reusable components and utilities
- **Type Safety**: TypeScript throughout the stack

### Data Flow

```
Frontend (React)
    ↓ React Query
API Client (Axios)
    ↓ HTTP
Backend (NestJS)
    ↓ Prisma
Database (PostgreSQL + pgvector)
```

### RAG Pipeline

```
User Query ("Tell me about cardiology devices")
    ↓
Generate Query Embedding (OpenAI text-embedding-3-small)
    ↓
Vector Similarity Search (pgvector cosine distance)
    ↓
Retrieve Top-5 Most Similar Document Chunks (threshold: 0.3)
    ↓
Build Context from Retrieved Chunks
    ↓
Generate Answer (OpenAI GPT-3.5-turbo) with Context
    ↓
Return Answer + Source Citations + Similarity Scores
```

**Key Features:**
- **Embedding Model**: text-embedding-3-small (1536 dimensions)
- **Completion Model**: gpt-3.5-turbo
- **Similarity Metric**: Cosine distance via pgvector `<=>` operator
- **Top-K Retrieval**: 5 most relevant chunks
- **Similarity Threshold**: 0.3 (configurable)
- **Source Citations**: Each answer includes product references with similarity scores

## 🔒 Environment Variables

Required variables in `.env`:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=medical_finder
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medical_finder?schema=public

# API
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# OpenAI (required for RAG features)
OPENAI_API_KEY=sk-your-api-key-here

# Frontend
VITE_API_BASE_URL=http://localhost:3000
```

## 🐛 Troubleshooting

### Docker Issues

```bash
# Reset everything
docker compose -f infra/docker-compose.yml down -v
npm run docker:up

# View logs
docker compose -f infra/docker-compose.yml logs -f
docker compose -f infra/docker-compose.yml logs api
docker compose -f infra/docker-compose.yml logs frontend
```

### Database Issues

```bash
# Reset database
npx prisma migrate reset

# Regenerate Prisma Client
npm run prisma:generate

# Reseed data
npm run seed:clear
```

### Frontend Issues

```bash
# Clear cache and rebuild
rm -rf apps/frontend/node_modules/.vite
docker compose -f infra/docker-compose.yml up --build frontend
```

### RAG/OpenAI Issues

```bash
# Check if OpenAI API key is loaded
docker compose -f infra/docker-compose.yml exec api printenv OPENAI_API_KEY

# Check embeddings in database
docker compose -f infra/docker-compose.yml exec db psql -U postgres -d medical_finder -c "SELECT COUNT(*) FROM \"DocumentChunk\" WHERE embedding IS NOT NULL;"

# Regenerate embeddings with force flag
npm run ingest:force

# If quota exceeded, check billing at https://platform.openai.com/account/billing
# Verify API key has sufficient credits
```

## 📚 Documentation

- **Implementation Strategy**: `docs/technical-implementation-strategy.md`
- **Implementation Checklist**: `docs/implementation-checklist.md`
- **Technical Design**: `docs/technical-design.md`
- **Developer Reference**: `docs/dev-reference.md`

## 🤝 Contributing

This is a portfolio project demonstrating full-stack TypeScript development with RAG capabilities. Feel free to explore the code and implementation patterns.

## 📄 License

MIT

## 🙏 Acknowledgments

Built with:
- Clean code principles (SOLID, DRY, SoC)
- Modern TypeScript best practices
- shadcn/ui for beautiful components
- OpenAI for AI capabilities
- pgvector for vector similarity search
