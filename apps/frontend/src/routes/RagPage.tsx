import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ragApi, RagQueryResponse, RagSource } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Send, Lightbulb, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Example questions to help users get started
 */
const EXAMPLE_QUESTIONS = [
  'What orthopedic products are under $500?',
  'Tell me about cardiology devices',
  'What imaging equipment is available?',
  'Show me surgical instruments for neurology',
];

/**
 * Component to display a single source citation
 */
function SourceCard({ source, index }: { source: RagSource; index: number }) {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Source {index + 1}
            </Badge>
            {source.score && (
              <Badge variant="secondary" className="text-xs">
                {(source.score * 100).toFixed(0)}% relevant
              </Badge>
            )}
          </div>
          {source.productId && (
            <Link to={`/products/${source.productId}`}>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                View Product
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
        <CardTitle className="text-base mt-2">{source.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{source.snippet}</p>
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for the answer
 */
function AnswerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
    </Card>
  );
}

/**
 * RAG Q&A Page Component
 *
 * Allows users to ask questions about medical products and get AI-powered answers
 * with source citations from the product database.
 */
export function RagPage() {
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [response, setResponse] = useState<RagQueryResponse | null>(null);

  // Mutation for querying the RAG system
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (question: string) => ragApi.query({ query: question }),
    onSuccess: (data) => {
      setResponse(data);
      setLastQuery(query);
      setQuery('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 3) {
      mutate(query.trim());
    }
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    mutate(exampleQuery);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ask AI About Products</h1>
        <p className="text-muted-foreground">
          Get instant answers about medical products powered by AI and our product database
        </p>
      </div>

      {/* Query Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Question</CardTitle>
          <CardDescription>
            Ask anything about our medical products, categories, specifications, or pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What are the best cardiology devices under $1000?"
              className="flex-1"
              disabled={isPending}
              minLength={3}
            />
            <Button type="submit" disabled={isPending || query.trim().length < 3}>
              {isPending ? (
                'Searching...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Ask
                </>
              )}
            </Button>
          </form>

          {/* Example Questions */}
          {!response && !isPending && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Try these examples:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_QUESTIONS.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExampleClick(example)}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error State */}
      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to process your question. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isPending && (
        <div className="space-y-4">
          <AnswerSkeleton />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      )}

      {/* Response */}
      {response && !isPending && (
        <div className="space-y-6">
          {/* Question Asked */}
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">You asked:</span> "{lastQuery}"
          </div>

          {/* AI Answer */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                AI Answer
                {response.metadata && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {response.sources.length} source{response.sources.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{response.answer}</p>

              {response.metadata && (
                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                  <span>
                    Retrieved {response.metadata.chunksRetrieved} relevant chunks
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sources/Citations */}
          {response.sources.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Sources & Citations</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {response.sources.map((source, index) => (
                  <SourceCard key={index} source={source} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* No Sources Warning */}
          {response.sources.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No sources found</AlertTitle>
              <AlertDescription>
                The AI couldn't find relevant product information to answer your question.
                Try rephrasing or asking about specific product categories.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
