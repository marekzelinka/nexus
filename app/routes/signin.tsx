import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { APIError } from "better-auth/api";
import { LoaderIcon } from "lucide-react";
import {
  data,
  Form,
  href,
  Link,
  redirect,
  useNavigation,
  useSearchParams,
} from "react-router";
import { z } from "zod";
import { ErrorList } from "~/components/error-list";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PasswordInput } from "~/components/ui/password-input";
import { auth } from "~/lib/auth.server";
import { EmailSchema, PasswordSchema } from "~/lib/user-validation";
import { safeRedirect } from "~/lib/utils";
import type { Route } from "./+types/signup";

const SigninSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  remember: z.boolean().optional(),
});

export const meta: Route.MetaFunction = () => [{ title: "Sign in" }];

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: SigninSchema,
  });
  if (submission.status !== "success") {
    return data(
      { result: submission.reply({ hideFields: ["password"] }) },
      { status: submission.status === "error" ? 400 : 200 },
    );
  }

  const { email, password, remember } = submission.value;

  const url = new URL(request.url);
  const redirectTo = safeRedirect(
    url.searchParams.get("redirectTo"),
    href("/"),
  );

  try {
    const authResponse = await auth.api.signInEmail({
      asResponse: true,
      body: { email, password, rememberMe: remember ?? false },
    });

    return redirect(redirectTo, {
      headers: authResponse.headers,
    });
  } catch (error) {
    if (error instanceof APIError) {
      return data(
        {
          result: submission.reply({
            hideFields: ["password"],
            formErrors: [error.body.message ?? error.message],
          }),
        },
        { status: 400 },
      );
    }

    throw error;
  }
}

export default function Signin({ actionData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();

  const [form, fields] = useForm({
    lastResult: actionData?.result,
    constraint: getZodConstraint(SigninSchema),
    shouldRevalidate: "onBlur",
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: SigninSchema }),
  });

  const navigation = useNavigation();
  const isPending = navigation.location?.pathname === href("/signin");

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle asChild className="text-xl">
            <h1>Sign in to your account</h1>
          </CardTitle>
          <CardDescription>
            Welcome back! Please sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" {...getFormProps(form)}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor={fields.email.id}>Email</Label>
                <Input
                  autoComplete="email"
                  {...getInputProps(fields.email, { type: "email" })}
                />
                <ErrorList id={fields.email.id} errors={fields.email.errors} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={fields.password.id}>Password</Label>
                <PasswordInput
                  autoComplete="current-password"
                  {...getInputProps(fields.password, { type: "password" })}
                />
                <ErrorList
                  id={fields.password.id}
                  errors={fields.password.errors}
                />
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    {...getInputProps(fields.remember, {
                      type: "checkbox",
                    })}
                  />
                  <Label htmlFor={fields.remember.id}>Remember me</Label>
                </div>
              </div>
              <ErrorList id={form.id} errors={form.errors} />
              <Button
                type="submit"
                disabled={isPending}
                className="relative w-full"
              >
                {isPending ? (
                  <LoaderIcon
                    aria-hidden
                    className="absolute inset-y-0 left-3 animate-spin place-self-center"
                  />
                ) : null}
                {isPending ? "Signing in…" : "Sign in"}
              </Button>
            </div>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to={{
                pathname: href("/signup"),
                search: searchParams.toString(),
              }}
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
