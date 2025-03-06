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
      route(":contactId", "routes/contact.tsx", [
        index("routes/contact-profile.tsx"),
        route("notes", "routes/contact-notes.tsx"),
        route("tasks", "routes/contact-tasks.tsx"),
        route("edit", "routes/edit-contact.tsx"),
        route("destroy", "routes/destroy-contact.tsx"),
      ]),
    ]),
  ]),
  ...prefix("api", [route("auth/*", "resources/auth-callback.tsx")]),
] satisfies RouteConfig;
