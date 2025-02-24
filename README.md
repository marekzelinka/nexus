# Nexus

This project is a simple, but feature-rich personal CRM.

It's written in [TypeScript](https://www.typescriptlang.org/) and uses [React](https://react.dev/), a JavaScript UI library, [React Router](https://reactrouter.com/), a full-stack framework, [Prisma](https://www.prisma.io/) for database ORM, [shadcn/ui](https://ui.shadcn.com/) for UI components and [Better Auth](https://www.better-auth.com/) for authentication. I'm hosting the live version at [Fly.io](https://fly.io/).

## Get started

1. Clone the repository:

   ```sh
   git clone https://github.com/marekzelinka/nexus.git
   ```

2. Install the dependencies:

   ```sh
   pnpm i
   ```

3. Define required env variables:

   - Copy the template contents in [.env.example](.env.example) to a new file named `.env` and fill all the required fields.
   - You'll need to [follow this guide](https://www.better-auth.com/docs/installation) to set the following credentials: `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.

4. Finally, run the app in dev mode by running:

   ```sh
   pnpm dev
   ```

## Goals

Practice working with React Router [data loadings](https://reactrouter.com/start/framework/data-loading) and [actions](https://reactrouter.com/start/framework/actions) APIs. Using [Prisma ORM](https://www.prisma.io/) with [SQLite](https://www.sqlite.org/). Try out the new `<Sidebar />` component from [shadcn/ui](https://ui.shadcn.com/).

## Credits

- App idea from [the official React Router tutorial](https://reactrouter.com/tutorials/address-book).
- Design inspiration by [Jim Nielsen](https://blog.jim-nielsen.com/).
- Features inspired by [Dex](https://getdex.com/), and [Clay](https://clay.earth/).
