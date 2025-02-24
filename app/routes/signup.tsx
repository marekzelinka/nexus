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
import { ErrorList } from "~/components/forms";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { auth } from "~/lib/auth.server";
import { EmailSchema, NameSchema, PasswordSchema } from "~/lib/user-validation";
import { safeRedirect } from "~/lib/utils";
import type { Route } from "./+types/signup";

const SignupSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});

export const meta: Route.MetaFunction = () => [{ title: "Sign up" }];

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: SignupSchema,
  });
  if (submission.status !== "success") {
    return data(
      { result: submission.reply({ hideFields: ["password"] }) },
      { status: submission.status === "error" ? 400 : 200 },
    );
  }

  const { name, email, password } = submission.value;

  const url = new URL(request.url);
  const redirectTo = safeRedirect(
    url.searchParams.get("redirectTo"),
    href("/"),
  );

  try {
    const authResponse = await auth.api.signUpEmail({
      body: { name, email, password },
      asResponse: true,
    });

    throw redirect(redirectTo, {
      headers: authResponse.headers,
    });
  } catch (error) {
    if (error instanceof APIError) {
      return data(
        {
          result: submission.reply({
            hideFields: ["password"],
            formErrors: [error.body.message as string],
          }),
        },
        { status: 400 },
      );
    }

    throw error;
  }
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();

  const [form, fields] = useForm({
    lastResult: actionData?.result,
    constraint: getZodConstraint(SignupSchema),
    shouldRevalidate: "onBlur",
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: SignupSchema }),
  });

  const navigation = useNavigation();
  const loading = navigation.location?.pathname === href("/signup");

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle asChild className="text-xl">
            <h1>Create an account</h1>
          </CardTitle>
          <CardDescription>
            Enter your details below to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" {...getFormProps(form)}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor={fields.name.id}>Name</Label>
                <Input
                  autoComplete="name"
                  {...getInputProps(fields.name, { type: "text" })}
                />
                <ErrorList id={fields.name.id} errors={fields.name.errors} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={fields.email.id}>Email</Label>
                <Input
                  autoComplete="email"
                  {...getInputProps(fields.email, { type: "email" })}
                />
                <ErrorList id={fields.email.id} errors={fields.email.errors} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={fields.password.id}>Password</Label>
                <Input
                  autoComplete="new-password"
                  {...getInputProps(fields.password, { type: "password" })}
                />
                <ErrorList
                  id={fields.password.id}
                  errors={fields.password.errors}
                />
              </div>
              <ErrorList id={form.id} errors={form.errors} />
              <Button
                type="submit"
                disabled={loading}
                className="relative w-full"
              >
                {loading ? (
                  <LoaderIcon
                    aria-hidden
                    className="absolute inset-y-0 left-3 animate-spin place-self-center"
                  />
                ) : null}
                {loading ? "Signing up…" : "Sign up"}
              </Button>
            </div>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to={{
                pathname: href("/signin"),
                search: searchParams.toString(),
              }}
              className="underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
      <Accordion type="single" collapsible className="px-6">
        <AccordionItem value="item-1">
          <AccordionTrigger>Terms of Service</AccordionTrigger>
          <AccordionContent>
            This is a demo app, there are no terms of service. Don't be
            surprised if your data dissappears.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Privacy Notice</AccordionTrigger>
          <AccordionContent>
            We won't use your email address for anything other than
            authenticating with this demo application. This app doesn't send
            email anyway, so you can put whatever fake email address you want.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
