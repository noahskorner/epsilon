import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/app/routes';

const capabilities = [
  {
    title: 'Index Management',
    description:
      'Provision pgvector-backed indexes, ingest documents with structured agent and search context, and filter with metadata.',
  },
  {
    title: 'Experiments',
    description:
      'Run A/B tests on chunking, content, prompts, and tools with deterministic test cases and scoring.',
  },
  {
    title: 'Agent Execution',
    description:
      'Execute workflows across baseline and experimental configurations to compare outcomes.',
  },
  {
    title: 'Conversations & Memory',
    description:
      'Persist conversation history, test memory-capture strategies, and stream responses via APIs.',
  },
];

const evaluation = [
  'LLM-as-judge with configurable prompts',
  'Human-in-the-loop scoring',
  'Deterministic replay of agent steps',
  'Traffic splitting across experimental indexes',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_55%)]" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 left-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-20 md:py-28">
          <div className="flex flex-col gap-5">
            <Badge className="w-fit bg-primary/10 text-primary">Agent Experimentation Platform</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Build, run, and evaluate AI agent experiments with confidence.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Epsilon helps you provision search indexes, run controlled experiments, and
              compare agent behavior across prompts, tools, and memory strategies.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={ROUTES.signIn}>Sign in to start</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={ROUTES.signIn}>Explore experiments</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/60 bg-background/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>Structured indexes</CardTitle>
                <CardDescription>
                  Store agent and search context alongside vectors and metadata for precise
                  retrieval.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/60 bg-background/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>Controlled experiments</CardTitle>
                <CardDescription>
                  Compare chunking, prompts, and toolchains with deterministic test cases.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/60 bg-background/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>Evaluation tooling</CardTitle>
                <CardDescription>
                  Score runs with LLM or human judges and track experiment results.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4">
          <Badge className="w-fit" variant="secondary">
            Core capabilities
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight">Everything you need to test agents.</h2>
          <p className="max-w-2xl text-muted-foreground">
            Design experiments that reveal where agents succeed, fail, and adapt to new
            contexts.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {capabilities.map((capability) => (
            <Card key={capability.title} className="border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">{capability.title}</CardTitle>
                <CardDescription>{capability.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <Badge className="w-fit bg-primary/10 text-primary">Evaluation</Badge>
            <h2 className="text-3xl font-semibold tracking-tight">
              Measure outcomes with repeatable workflows.
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Combine deterministic runs with flexible scoring to validate improvements
              before you ship.
            </p>
          </div>
          <div className="grid gap-3 rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
            {evaluation.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-foreground">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16">
        <div className="rounded-2xl border border-border/60 bg-background p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <Badge className="w-fit" variant="secondary">
                Ready to run experiments?
              </Badge>
              <h3 className="text-2xl font-semibold tracking-tight">Start with a fresh index.</h3>
              <p className="max-w-xl text-muted-foreground">
                Provision a pgvector-backed index and launch your first experiment in minutes.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href={ROUTES.signIn}>Create an index</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
