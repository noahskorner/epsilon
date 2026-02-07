'use client';

import { BookOpen, Bot, Flame, Mail, Sparkles, Target } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from 'next-auth/react';
import { ROUTES } from '../routes';
import { z } from '../utils/zod';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});
type LoginFormSchema = z.infer<typeof schema>;

export default function Login() {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async ({ email }: LoginFormSchema) => {
    await signIn('email', { email, callbackUrl: ROUTES.dashboard.home });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(253,186,116,0.22),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.18),transparent_38%),linear-gradient(160deg,rgba(15,23,42,0.04),rgba(15,23,42,0.02))]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.06),transparent_40%,rgba(15,23,42,0.08))]" />
      <div className="pointer-events-none absolute right-[-10%] top-[8%] h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12%] left-[6%] h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-6 py-12 lg:flex-row lg:items-center lg:gap-16 lg:py-20">
        <div className="flex max-w-xl flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-primary/30 bg-background/70 px-4 py-2 text-sm font-medium text-primary shadow-sm lg:self-start">
            <Sparkles className="h-4 w-4" aria-hidden />
            AI learning studio
          </div>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Sign in to build courses that keep learners moving.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Create structured learning paths, generate assets in minutes, and measure real progress
            with feedback that helps students improve.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border bg-background/80 p-4 shadow-sm backdrop-blur">
              <Bot className="mt-1 h-4 w-4 text-sky-500" aria-hidden />
              <div>
                <p className="text-sm font-medium text-foreground">AI course builder</p>
                <p className="text-muted-foreground text-sm">
                  Generate syllabi, assets, and assessments in one flow.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border bg-background/80 p-4 shadow-sm backdrop-blur">
              <Target className="mt-1 h-4 w-4 text-emerald-500" aria-hidden />
              <div>
                <p className="text-sm font-medium text-foreground">Milestone tracking</p>
                <p className="text-muted-foreground text-sm">
                  Track completion, scores, and learning streaks.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 rounded-2xl border bg-background/70 p-4 text-left shadow-sm backdrop-blur">
            <div className="flex items-center gap-3 text-sm">
              <BookOpen className="h-4 w-4 text-primary" aria-hidden />
              <span className="font-medium text-foreground">Your next course draft</span>
            </div>
            <div className="grid gap-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                <span>Foundations and overview</span>
                <span className="font-medium text-foreground">15 min</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                <span>Practice and guided exercise</span>
                <span className="font-medium text-foreground">25 min</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                <span>Reflection and feedback</span>
                <span className="font-medium text-foreground">10 min</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-md border border-border/60 bg-background/95 shadow-lg backdrop-blur">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Flame className="h-4 w-4" aria-hidden />
              <span>Resume your learning streak</span>
            </div>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription className="leading-relaxed">
              We use passwordless magic links. Enter your email to receive a secure sign-in link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Sending magic link...' : 'Email me a magic link'}
                </Button>
              </form>
            </Form>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" aria-hidden />
              Check your inbox for a one-time sign-in link.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
