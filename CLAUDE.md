# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript monorepo (`@rtpackx/monorepo`) that provides utility libraries for multiple JavaScript frameworks (Vue, React, NestJS) and build tools (Vite). The project uses pnpm workspaces and builds framework-agnostic utilities in `core` that are extended by framework-specific packages.

## Common Commands

### Development
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build                    # Build source + types
pnpm build:dts                # Build TypeScript declarations only
tsx scripts/build.ts          # Build source files only

# Linting
pnpm lint                     # Check code style
pnpm lint:fix                 # Fix code style issues
pnpm lint-staged              # Run lint on staged files (pre-commit hook)
```

### Testing
```bash
# Run tests
pnpm test                     # Run vitest with coverage
pnpm test-coverage            # Run tests without watch mode

# Run single test file
npx vitest path/to/test.spec.ts
```

### Documentation (VitePress)
```bash
pnpm docs:dev                 # Start dev server at packages directory
pnpm docs:preview             # Preview built docs
pnpm docs:build               # Build documentation
```

### Release & Publishing
```bash
pnpm release                  # Bump version using bumpp, create tag, generate changelog
pnpm push                     # Push commits and tags to remote
pnpm publish:r                # Release and push (full workflow)
```

## Architecture

### Monorepo Structure
```
packages/
├── core/       - Framework-agnostic utilities (base layer)
├── vue/        - Vue 3 composables and utilities
├── react/      - React hooks and utilities
├── nestjs/     - NestJS utilities and decorators
└── vite/       - Vite plugins and build utilities
```

### Package Dependencies
- `@rtpackx/core` is the foundation - all other packages can depend on it
- `@rtpackx/vue` depends on core and requires `vue` and `vue-router` as peer dependencies
- Each package builds to ESM (.mjs) and CommonJS (.cjs) formats with TypeScript declarations (.d.ts)

### Build System

**Build Configuration**: Located in `meta/packages.ts` - defines entry points, output directories, and external dependencies for each package.

**Build Process**:
1. `scripts/build.ts` - Uses Vite to bundle source files into dist/ directories
   - Removes console/debugger statements via esbuild
   - Handles Vue/JSX plugins conditionally based on package needs
   - Externalizes framework dependencies (vue, react, @nestjs/*, etc.)

2. `scripts/build-dts.ts` - Uses rollup with rollup-plugin-dts to generate type declarations
   - Bundles all .d.ts files into single index.d.ts per package

**Alias Configuration**: `meta/alias.ts` defines `@` alias pointing to packages directory for cross-package imports during development.

### Code Organization Patterns

**Core Package** (`packages/core/src/`):
- `utils/` - Pure utility functions (is.ts, string.ts, time.ts, trait.ts)
- `use-*` directories - Composable-style utilities that return objects with methods (e.g., `useCache`, `useSpliter`)
- `indexdb/` - IndexedDB wrapper
- `monitor/` - Performance/error monitoring utilities

**Vue Package** (`packages/vue/src/`):
- Follows Vue Composition API patterns
- `use-*` directories for composables (e.g., `useExtRouter`, `useRouteListener`, `useSelect`, `useTree`)
- Exports utility functions for router manipulation

**NestJS Package** (`packages/nestjs/src/`):
- `Assert.ts` - Runtime assertion utilities using NestJS exceptions
- Uses class-validator for validation

**Vite Package** (`packages/vite/src/`):
- Vite plugins for build optimization (lazyload-normalize, staticload-normalize)
- Note: compress plugin has build issues, currently commented out

### Key Implementation Details

1. **Composable Pattern**: Functions prefixed with `use` return objects with methods, not reactive refs. Example:
   ```typescript
   export function useCache() {
     const cache = new Map();
     return { get, set, delete, clear };
   }
   ```

2. **Router Utilities**: Vue router helpers handle dynamic route management:
   - `resetRouter` - Clear routes except specified exclusions
   - `addRoutes` - Batch add routes with deduplication via `deepDelete`
   - `goBackOrDefault` - Navigate back with fallback, validates history state

3. **Build Optimizations**: esbuild config drops console/debugger but preserves comments by disabling minifyWhitespace/minifySyntax.

## Git Workflow

- **Commit Convention**: Uses conventional commits (@commitlint/config-conventional)
- **Pre-commit Hook**: Runs lint-staged (prettier + eslint)
- **Commit Message Hook**: Validates commit message format via `scripts/verify-commit.ts`

**Release Process** (automated by `scripts/release.ts`):
1. Bump version with bumpp (no commit/tag/push)
2. Create git commit with version bump
3. Create git tag
4. Generate CHANGELOG.md via conventional-changelog
5. Create second commit with changelog updates

## Package Manager Requirements

- **Required**: pnpm@10.23.0 (enforced by packageManager field)
- **Node Version**: >=20.0.0
- **Preinstall Hook**: Uses only-allow to enforce pnpm

## Testing Notes

- Tests use Vitest with jsdom environment
- Global test utilities available via types in tsconfig.json
- No test files found in current structure - tests may be in separate location or not yet implemented
