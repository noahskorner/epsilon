import Link from 'next/link';

import { ROUTES } from '@/app/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const METRICS = [
  {
    label: 'Indexes',
    value: '3',
    note: '2 ready, 1 ingesting',
    status: 'Healthy',
  },
  {
    label: 'Experiments',
    value: '5',
    note: '2 running, 3 queued',
    status: 'Active',
  },
  {
    label: 'Evaluations',
    value: '128',
    note: 'LLM + human judge',
    status: 'In review',
  },
];

const EXPERIMENTS = [
  {
    name: 'Chunk Size Sweep',
    detail: 'Support Docs index • 60/40 traffic split',
    status: 'Running',
  },
  {
    name: 'Agent Prompt Variant B',
    detail: 'Billing Q&A agent • variant toolset',
    status: 'Queued',
  },
  {
    name: 'Memory Capture v2',
    detail: 'Conversation retention • 12 scenarios',
    status: 'Draft',
  },
];

const PIPELINE = [
  {
    label: 'Ingestion',
    value: 'Staged docs',
    description: 'Ready for embedding pass',
  },
  {
    label: 'Agent Execution',
    value: '12 runs waiting',
    description: 'Prioritize A/B workflows',
  },
  {
    label: 'Judging',
    value: '6 evaluations',
    description: 'Human review scheduled',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Experiment control center</p>
            <h2 className="text-2xl font-semibold">Build, run, and evaluate agent systems</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Spin up pgvector-backed indexes, configure agent variants, and track evaluations in
              one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild>
              <Link href={ROUTES.dashboard.indexes.new}>Create index</Link>
            </Button>
            <Button variant="outline" disabled>
              New experiment
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {METRICS.map((metric) => (
            <Card key={metric.label}>
              <CardHeader className="gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold">{metric.value}</span>
                  <Badge variant="secondary">{metric.status}</Badge>
                </div>
                <CardDescription>{metric.note}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Active experiments</CardTitle>
            <CardDescription>Track running tests and queued variants.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {EXPERIMENTS.map((experiment, index) => (
              <div key={experiment.name} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{experiment.name}</p>
                    <p className="text-sm text-muted-foreground">{experiment.detail}</p>
                  </div>
                  <Badge variant="outline">{experiment.status}</Badge>
                </div>
                {index < EXPERIMENTS.length - 1 ? <Separator /> : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline focus</CardTitle>
            <CardDescription>What to triage next in the workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {PIPELINE.map((item, index) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{item.value}</span>
                </div>
                {index < PIPELINE.length - 1 ? <Separator /> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Index management</CardTitle>
            <CardDescription>Provision pgvector indexes and manage document sets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Provisioned environments</span>
              <span className="text-foreground">2 active</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Documents ingested</span>
              <span className="text-foreground">18,240</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Metadata filters</span>
              <span className="text-foreground">7 saved</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent execution</CardTitle>
            <CardDescription>
              Run workflows across standard and experimental agents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Workflow runs today</span>
              <span className="text-foreground">42</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tool variants</span>
              <span className="text-foreground">5 configured</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Conversation memory</span>
              <span className="text-foreground">3 strategies</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
