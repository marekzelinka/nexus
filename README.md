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

4. Finally, run the app in dev mode by running:

   ```sh
   pnpm dev
   ```

## Goals

Practice working with Remix [data loadings APIs](https://remix.run/docs/en/main/guides/data-loading) and [Prisma ORM](https://www.prisma.io/).

## Credits

- App idea from [Official Remix Tutorial](https://remix.run/docs/en/main/start/tutorial)
- Design inspiration by [Jim Nielsen](https://blog.jim-nielsen.com/)
- Features inspired by [Dex](https://getdex.com/), and [Clay](https://clay.earth/)
- Logo from [Shapes](https://shapes.framer.website/)
