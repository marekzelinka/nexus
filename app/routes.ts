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
  layout("layouts/dashboard.tsx", [
    route("contacts", "routes/contacts.tsx", [
      index("routes/select-contact.tsx"),
      ...prefix(":contactId", [
        index("routes/contact.tsx"),
        route("edit", "routes/edit-contact.tsx"),
        route("destroy", "routes/destroy-contact.tsx"),
      ]),
    ]),
  ]),
  ...prefix("api", [route("auth/*", "resources/auth-hook.tsx")]),
] satisfies RouteConfig;
