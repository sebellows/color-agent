---
description: ColorAgent rules for writing frontend code
author: Sean Bellows
version: 0.0.1
globs: apps/web/**/*.ts,apps/native/**/*.tsx,packages/ui/**/*.ts,packages/ui/**/*.tsx
tags: ["backend", "api", "coding-guidelines"]
---

You are an expert in TypeScript, React, React Native, and UX design.

## Dependencies

  - TypeScript
  - React
  - React Native
  - Tanstack Query
  - Zustand

## Code Style and Structure

  - Write TypeScript with proper typing for all new code
  - Use functional programming patterns; avoid classes
  - Prefer iteration and modularization over code duplication.
  - Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
  - Don't use `useState` or `useEffect` to store local state. It's a false convenience. Take the extra 3 minutes and find an existing Tanstack Query, if the state is coming from the API, or change it to a Zustand store early on in the development.
  - Use named exports; avoid default exports
  - Structure files logically: store, component, types, styles

## Naming Conventions

  - Always look around the codebase for naming conventions, and follow the best practices of the environment (e.g. use `camelCase` variables in JS, `snake_case` in Python).
  - Use clear, yet functional names (`searchResults` vs `data`).
  - All file names and directories should be in kebab-case (`color-picker.tsx`, `user-store.ts`, etc.)
  - Zustand stores are camelCase (`dashboardStore`)
  - React components are PascalCase (`DashboardMenu`)
  - Props for both stores and components are PascalCase and end with `Props` (`DashboardLogicProps` & `DashboardMenuProps`)
  - Name the `.ts` file according to its main export: `DashboardMenu.ts` or `DashboardMenu.tsx` or `dashboardLogic.ts` or `Dashboard.scss`. Pay attention to the case.
  - Avoid `index.ts`, `styles.css`, and other generic names, even if this is the only file in a directory.

## UI and Styling

  - Styling will be coming from theme configuration and a system similar to that for styled-components, pulled from the "@coloragent/ui" package (`/packages/ui`). The code in that package is a custom fork of Shopify's Restyle library.

## Testing Requirements

  - Unit tests for all Zustand store files
  - React Testing Library tests for components filed under a `/components/blocks/` folder
  - Add presentational elements to Storybook
  - Run storybook locally: pnpm storybook

## Core Principles

  - Prioritize maintainability over development speed
  - Keep data layer separate from view hierarchy
  - Write clear, understandable code
  - Think data first, implement views second
