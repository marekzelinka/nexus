import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  layout("layouts/auth.tsx", [
    route("signup", "routes/signup.tsx"),
    route("signin", "routes/signin.tsx"),
  ]),
  ...prefix("api", [route("auth/*", "resources/better-auth.tsx")]),
] satisfies RouteConfig;
