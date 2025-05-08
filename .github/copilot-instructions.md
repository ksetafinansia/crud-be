<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->


# GitHub Copilot Instructions

These instructions apply to a Next.js project using TypeScript, Tailwind CSS, and REST APIs.

- Use TypeScript in all source files.
- Set up Tailwind CSS for styling and configure custom theme if needed.
- Organize code into the following folders:
  - components/: Reusable UI components
  - lib/: Utility functions and API calls
  - hooks/: Custom React hooks
  - context/: React context providers
  - styles/: Global and modular styles
- Use the app/ directory if using Next.js 13+ with the App Router.
- Use .env.local for environment variables and load them via process.env.
- Create reusable components like Button, Card, Modal using Tailwind.
- Use next/head to manage meta tags for SEO.
- Centralize fetch/axios calls in lib/api.ts with error handling.
- Use React Context or Zustand for global state management.
- Use next-auth for authentication where needed.
- Enable CORS if calling external APIs.
- Use Jest and React Testing Library for unit testing.
- Use Cypress for E2E tests if applicable.
- Set up ESLint and Prettier with recommended or Airbnb config.
- Add lint and format npm scripts in package.json.
- Add dynamic imports for heavy components to optimize performance.
- Use GitHub Actions for CI/CD to deploy to Vercel or Netlify.
