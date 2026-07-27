# Graph Report - .  (2026-07-27)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 275 nodes · 286 edges · 26 communities (21 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8275773e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- dependencies
- .eslintrc.json
- package.json
- app.ts
- compilerOptions
- devDependencies
- package.json
- package.json
- package.json
- Header.tsx
- compilerOptions
- auth.controller.ts
- include
- create_milestones.py
- seed.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- test_config.js

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `compilerOptions` - 10 edges
3. `include` - 7 edges
4. `scripts` - 6 edges
5. `scripts` - 6 edges
6. `extends` - 5 edges
7. `logger` - 5 edges
8. `scripts` - 5 edges
9. `make_request()` - 4 edges
10. `get_existing_milestones()` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (26 total, 5 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.06
Nodes (35): eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier, prettier, prisma (+27 more)

### Community 1 - "dependencies"
Cohesion: 0.09
Nodes (23): bcryptjs, compression, cookie-parser, cors, express, helmet, jsonwebtoken, dependencies (+15 more)

### Community 2 - ".eslintrc.json"
Cohesion: 0.10
Nodes (20): env, es2022, node, extends, parser, parserOptions, ecmaVersion, project (+12 more)

### Community 3 - "package.json"
Cohesion: 0.11
Nodes (18): dotenv, devDependencies, dotenv, prisma, typescript, prisma, typescript, name (+10 more)

### Community 4 - "app.ts"
Cohesion: 0.19
Nodes (10): app, authController, getHealth, asyncHandler(), CustomError, errorHandler(), router, router (+2 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+9 more)

### Community 7 - "package.json"
Cohesion: 0.12
Nodes (15): next, dependencies, next, react, react-dom, name, private, scripts (+7 more)

### Community 8 - "package.json"
Cohesion: 0.12
Nodes (15): author, description, devDependencies, @types/node, typescript, @types/node, typescript, keywords (+7 more)

### Community 9 - "package.json"
Cohesion: 0.13
Nodes (14): author, description, keywords, license, main, name, scripts, build (+6 more)

### Community 10 - "Header.tsx"
Cohesion: 0.22
Nodes (6): geistMono, geistSans, metadata, Button(), ButtonProps, ButtonGroup()

### Community 11 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, outDir, rootDir, skipLibCheck (+3 more)

### Community 12 - "auth.controller.ts"
Cohesion: 0.27
Nodes (5): authService, cookieOptions, AuthService, RegisterDto, registerSchema

### Community 13 - "include"
Cohesion: 0.20
Nodes (9): exclude, include, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+1 more)

### Community 14 - "create_milestones.py"
Cohesion: 0.39
Nodes (7): extract_sections_from_markdown(), get_existing_milestones(), main(), make_request(), Make an HTTP request and return (response_body, status_code, headers)., Fetch all milestones (open and closed) for the repository., Extract sections from a markdown file.     Returns a list of tuples: (title, con

## Knowledge Gaps
- **141 isolated node(s):** `name`, `version`, `private`, `packages/*`, `dev` (+136 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _141 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `.eslintrc.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._