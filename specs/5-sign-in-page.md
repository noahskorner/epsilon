### Goal

Design and implement a minimal sign-in page using **magic link (email) authentication**.

### Requirements

- Use **shadcn/ui** components.
- Follow best practices for:
  - Accessibility (labels, focus states, ARIA where appropriate)
  - Form validation
  - Loading and error states
- Validate email input using a schema-based approach.
- On submit, trigger magic link sign-in and redirect to the dashboard on success.
- Keep the UI simple and focused on email-only authentication.

### Reference Implementation

Use the following example as a baseline for wiring up validation and submission logic:

```ts
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
    await signIn('email', {
      email,
      callbackUrl: ROUTES.dashboard.home,
    });
  };
}
```
