import { ArrowRight, BookOpen, Sparkles, Target } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ROUTES } from '@/app/routes';

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <section
        className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary-50 via-background
        to-background p-8 shadow-sm dark:from-primary-950/40"
      >
        <div
          className="pointer-events-none absolute -right-12 top-6 size-56 rounded-full bg-primary/10
          blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-10 size-64 rounded-full bg-primary/15
          blur-3xl"
        />
        <Badge className="w-fit" variant="secondary">
          Empty dashboard
        </Badge>
        <div className="mt-6 max-w-2xl space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Start building an AI-native learning path.
          </h2>
          <p className="text-muted-foreground">
            Your dashboard is ready for new courses, structured assets, and live feedback. Generate
            your first syllabus or explore community content to begin tracking progress.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2" asChild>
              <Link href={ROUTES.dashboard.course.designer}>
                Generate a course <Sparkles className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" className="gap-2">
              Browse courses <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="size-4 text-muted-foreground" />
              No active courses
            </CardTitle>
            <CardDescription>
              Once you enroll or generate a course, your next lessons will appear here.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="size-4 text-muted-foreground" />
              Progress tracking
            </CardTitle>
            <CardDescription>
              Track completion, scores, and milestones as you move through assets.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-muted-foreground" />
              AI feedback ready
            </CardTitle>
            <CardDescription>
              Receive structured critiques and encouragement when you submit work.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <Card className="border bg-muted/40">
        <CardHeader>
          <CardTitle className="text-base">Suggested next steps</CardTitle>
          <CardDescription>
            Follow a quick setup to unlock the full workflow when you are ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <div className="rounded-lg border border-dashed bg-background/60 p-4">
            Create your first course outline.
          </div>
          <div className="rounded-lg border border-dashed bg-background/60 p-4">
            Import assets from YouTube, PDFs, or URLs.
          </div>
          <div className="rounded-lg border border-dashed bg-background/60 p-4">
            Invite a learner to track progress together.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
