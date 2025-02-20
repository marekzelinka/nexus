import { Form, href, Link, useSearchParams } from "react-router";
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
import type { Route } from "./+types/signup";

export const meta: Route.MetaFunction = () => [{ title: "Sign up" }];

export default function Signup() {
  const [searchParams] = useSearchParams();

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
          <Form method="post">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign up
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
