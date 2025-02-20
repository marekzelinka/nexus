import { Form, href, Link, useSearchParams } from "react-router";
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
import type { Route } from "./+types/signup";

export const meta: Route.MetaFunction = () => [{ title: "Sign in" }];

export default function Signin() {
  const [searchParams] = useSearchParams();

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
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox name="remember" id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <Button type="submit" className="w-full">
                Sign in
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
