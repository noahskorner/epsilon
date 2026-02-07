'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CreateIndexRequestSchema } from '@/app/api/indexes/create-index.request';
import { ROUTES } from '@/app/routes';
import { z } from '@/app/utils/zod';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { createIndexAction } from './create-index.actions';

const STEPS = [
  {
    title: 'Index basics',
    description: 'Name the index and describe its purpose.',
  },
  {
    title: 'Provisioning plan',
    description: 'Review what we will provision for the index.',
  },
  {
    title: 'Review & confirm',
    description: 'Confirm details before provisioning the database.',
  },
] as const;

const CreateIndexWizardSchema = CreateIndexRequestSchema.extend({
  confirmation: z.string(),
});

type CreateIndexWizardValues = z.infer<typeof CreateIndexWizardSchema>;

export function CreateIndexWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateIndexWizardValues>({
    resolver: zodResolver(CreateIndexWizardSchema),
    defaultValues: {
      name: '',
      description: '',
      confirmation: '',
    },
  });

  const nameValue = form.watch('name');
  const descriptionValue = form.watch('description');
  const confirmationValue = form.watch('confirmation');
  const totalSteps = STEPS.length;
  const isLastStep = step === totalSteps - 1;
  const progress = Math.round(((step + 1) / totalSteps) * 100);
  const isConfirmationMatch =
    confirmationValue.trim().length > 0 && confirmationValue.trim() === nameValue.trim();

  const handleNext = async () => {
    setServerError(null);

    if (step === 0) {
      const isValid = await form.trigger(['name', 'description']);
      if (!isValid) {
        return;
      }

      const trimmedName = form.getValues('name').trim();
      if (!trimmedName) {
        form.setError('name', {
          type: 'validate',
          message: 'Index name is required.',
        });
        return;
      }

      if (trimmedName !== form.getValues('name')) {
        form.setValue('name', trimmedName, { shouldValidate: true });
      }
    }

    setStep((current) => Math.min(current + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setServerError(null);
    setStep((current) => Math.max(current - 1, 0));
  };

  const onSubmit = (values: CreateIndexWizardValues) => {
    const trimmedName = values.name.trim();
    const trimmedConfirmation = values.confirmation.trim();

    if (!trimmedConfirmation) {
      form.setError('confirmation', {
        type: 'validate',
        message: 'Type the index name to confirm.',
      });
      return;
    }

    if (trimmedConfirmation !== trimmedName) {
      form.setError('confirmation', {
        type: 'validate',
        message: 'Index name does not match.',
      });
      return;
    }

    startTransition(async () => {
      setServerError(null);
      form.clearErrors('confirmation');

      const result = await createIndexAction({
        name: trimmedName,
        description: values.description?.trim() || undefined,
      });

      if (result.status === 'error') {
        setServerError(result.message);
        return;
      }

      router.push(ROUTES.dashboard.indexes.home);
    });
  };

  const handleFormSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={ROUTES.dashboard.indexes.home}>Indexes</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>New index</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-semibold">Create a new index</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Provision a dedicated pgvector database and start configuring ingestion.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Index creation wizard</CardTitle>
              <CardDescription>{STEPS[step].description}</CardDescription>
            </div>
            <Badge variant="secondary">
              Step {step + 1} of {totalSteps}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {STEPS.map((item, index) => (
                <div
                  key={item.title}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-sm transition flex flex-col gap-2',
                    index === step
                      ? 'border-primary/40 bg-primary/5 text-foreground'
                      : 'border-border/60 text-muted-foreground'
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide">Step {index + 1}</p>
                  <p className="text-sm font-medium">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={(event) => {
                if (!isLastStep) {
                  event.preventDefault();
                  void handleNext();
                  return;
                }

                void handleFormSubmit(event);
              }}
            >
              {serverError ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {serverError}
                </div>
              ) : null}

              {step === 0 ? (
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Index name</FormLabel>
                        <FormControl>
                          <Input placeholder="Support articles" autoComplete="off" {...field} />
                        </FormControl>
                        <FormDescription>
                          Use a human-friendly name. We will verify uniqueness before provisioning.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Indexes support and troubleshooting documents."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional context for teammates and future ingestion pipelines.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Naming tips</p>
                    <p>
                      Pick a name that reflects the dataset or product surface. A database name will
                      be generated automatically from this label.
                    </p>
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="grid gap-4">
                  <div className="grid gap-3 rounded-lg border bg-muted/40 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">Provisioned database</p>
                      <Badge variant="secondary">pgvector</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We create a dedicated database and schema for this index. Provisioning starts
                      after confirmation.
                    </p>
                  </div>
                  <div className="grid gap-3 rounded-lg border bg-muted/40 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">Data sources</p>
                      <Badge variant="outline">Start empty</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can connect ingestion pipelines after the index is created.
                    </p>
                  </div>
                  <div className="grid gap-2 rounded-lg border p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">After creation</p>
                    <p>Upload documents, configure chunking, and test retrieval before go-live.</p>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-6">
                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-muted-foreground">Index name</span>
                        <span className="text-sm font-medium">
                          {nameValue.trim() || 'Untitled index'}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-muted-foreground">Description</span>
                        <span className="text-sm font-medium">
                          {descriptionValue?.trim() || 'No description'}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-muted-foreground">Provisioning</span>
                        <span className="text-sm font-medium">Dedicated pgvector database</span>
                      </div>
                      <Separator />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-muted-foreground">Data sources</span>
                        <span className="text-sm font-medium">Start empty</span>
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type the index name to confirm</FormLabel>
                        <FormControl>
                          <Input placeholder="Repeat the index name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This prevents accidental provisioning. The name must match exactly.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 0 || isPending}
                >
                  Back
                </Button>
                <div className="flex flex-wrap items-center gap-2">
                  {!isLastStep ? (
                    <Button type="button" onClick={handleNext} disabled={isPending}>
                      Continue
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isPending || !isConfirmationMatch}>
                      {isPending ? 'Provisioning index...' : 'Create index'}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
