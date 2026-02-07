import Link from 'next/link';
import { ArrowRight, BookOpen, Bot, CheckCircle2, GraduationCap, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg border">
              <Sparkles className="size-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">epsilon</span>
            <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
              AI-native learning
            </Badge>
          </Link>

          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/courses">Browse</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/assets">Assets</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4">
        <section className="py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                <Bot className="size-4" />
                <span>Generate courses, grade answers, track progress</span>
              </div>

              <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                Learn faster with structured courses built from atomic learning assets.
              </h1>

              <p className="text-balance text-muted-foreground md:text-lg">
                Discover community courses or generate a full syllabus with exercises and feedback.
                Measure progress with completion, scores, milestones, and streaks.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/courses">
                    Browse courses <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/course-builder">
                    AI Course Builder <Sparkles className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">Lectures</Badge>
                <Badge variant="secondary">Readings</Badge>
                <Badge variant="secondary">Exercises</Badge>
                <Badge variant="secondary">Quizzes</Badge>
                <Badge variant="secondary">Projects</Badge>
                <Badge variant="secondary">Feedback</Badge>
              </div>
            </div>

            {/* Right-side highlight */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="size-5" />
                  Your learning dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Stat label="Active courses" value="3" />
                  <Stat label="Assets completed" value="18" />
                  <Stat label="XP this week" value="240" />
                  <Stat label="Streak" value="5 days" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Currently learning</span>
                    <Link href="/courses" className="text-muted-foreground hover:underline">
                      View all
                    </Link>
                  </div>
                  <MiniRow title="Intro to Linear Algebra" meta="Beginner · 2h/wk" />
                  <MiniRow title="Systems Design Drills" meta="Intermediate · 3h/wk" />
                  <MiniRow title="Writing with Clarity" meta="All levels · 1h/wk" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feature grid */}
        <section className="pb-14 md:pb-20">
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Asset-first learning"
              icon={<BookOpen className="size-5" />}
              bullets={[
                'Create or import assets from YouTube, URLs, and PDFs',
                'AI summaries, key concepts, difficulty, time estimates',
                'Reusable assets across multiple courses',
              ]}
              href="/assets"
              cta="Explore assets"
            />
            <FeatureCard
              title="Courses in minutes"
              icon={<Sparkles className="size-5" />}
              bullets={[
                'AI-generated syllabus with structured outputs',
                'Exercises + solutions + final evaluation',
                'Public/private visibility and creator attribution',
              ]}
              href="/course-builder"
              cta="Build a course"
            />
            <FeatureCard
              title="Progress that matters"
              icon={<CheckCircle2 className="size-5" />}
              bullets={[
                'Enrollment + completion tracking per asset',
                'Auto-graded MCQ + LLM graded free response',
                'XP, streaks, coins, badges (optional leaderboards)',
              ]}
              href="/progress"
              cta="View progress"
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pb-16">
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center">
              <div className="space-y-1">
                <div className="text-lg font-semibold">Ready to start learning?</div>
                <div className="text-sm text-muted-foreground">
                  Sign in to enroll, track progress, and publish courses.
                </div>
              </div>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/courses">Browse courses</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} epsilon</div>
          <div className="flex gap-4 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" href="/privacy">
              Privacy
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/terms">
              Terms
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/about">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function MiniRow({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{meta}</div>
      </div>
      <ArrowRight className="ml-3 size-4 shrink-0 text-muted-foreground" />
    </div>
  );
}

function FeatureCard({
  title,
  icon,
  bullets,
  href,
  cta,
}: {
  title: string;
  icon: React.ReactNode;
  bullets: string[];
  href: string;
  cta: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm text-muted-foreground">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-0.5">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>
            {cta} <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
