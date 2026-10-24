# Repository Guidelines

## Project Structure & Module Organization

This repository combines a Vue 3 frontend with a Cloudflare Worker backend using JavaScript ES modules.

- `src/views/` contains route pages; `src/router/` defines navigation.
- `src/components/` holds reusable Vue components; `src/composables/` holds shared reactive behavior using `useX` functions.
- `src/api/index.js` centralizes frontend requests and authentication redirects.
- `src/assets/` contains bundled styles and images; `public/` contains static assets.
- `server/index.js` handles Worker requests, `auth.js` handles authentication, and `service.js` provides API handlers. Utility modules live alongside them.
- `wrangler.jsonc` configures the Worker and bindings; `.github/workflows/build.yml` handles deployment.

## Build, Test, and Development Commands

- `bun install`: install dependencies; keep `bun.lock` updated with dependency changes.
- `bun run dev`: start Vite with hot reload and `VITE_DEV_MODE=true`.
- `bun run build`: generate production frontend and Worker bundles.
- `bun run preview`: build, then run locally through Wrangler.
- `bun run deploy`: build and deploy to Cloudflare; use only for intended releases.

## Coding Style & Naming Conventions

Follow `.editorconfig`: four spaces for JavaScript, MJS, and Vue files, with a maximum line length of 150. Preserve surrounding quote and semicolon conventions when editing existing code. No formatter or linter is configured.

Use PascalCase for Vue components (`ConfirmDialog.vue`), camelCase for functions and variables, and `useX.js` for composables. Prefer Vue's `<script setup>` pattern and the `@/` alias for frontend imports. Keep request handling, authentication, and reusable utilities in their existing modules.

## Testing Guidelines

No automated test framework, test script, test directory, or coverage threshold is currently configured. Run `bun run build` and exercise affected behavior locally. Use the `ego-browser` skill exclusively for frontend acceptance checks. For authentication changes, verify with `bun run preview`: development mode bypasses authentication. Document verification steps and results in the PR.

## Commit & Pull Request Guidelines

History contains brief English and Chinese subjects (`fix`, `初始化修改`) without a formal convention. Write concise, descriptive imperative subjects naming the affected behavior. Keep commits focused.

PRs should explain the change, link relevant issues, and list validation performed. Include screenshots for visible UI changes and configuration notes when bindings change. Pushes to `master` trigger production deployment.

## Security & Configuration

Keep credentials in Wrangler secrets or ignored `.dev.vars*` files. The Worker uses KV binding `authdata` and D1 binding `DB`; preserve binding names. Never enable the development authentication bypass in production.

## SQL 文件管理

- 开发过程中产生的 SQL 必须记录到仓库根目录的 `sql/` 文件夹中；目录不存在时创建。
- 每次新增 SQL 都创建独立文件，按三位递增序号和简短描述命名，例如 `001-create-users.sql`、`002-add-user-status.sql`。
- 仅在用户明确要求时合并 SQL 文件；未要求时不要主动合并。
- 本地验证时可以直接执行 SQL 文件；正式环境不得自动执行，必须等待用户明确指示。
