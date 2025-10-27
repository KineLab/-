# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Context

This is a **learning repository** for studying the technology stack used in the KineLab project - a SaaS platform for AI video generation and editing. The repository contains:

- Documentation and guides in Russian
- Step-by-step lessons (урок1/, урок2/, etc.)
- A practice Phoenix application (`learning_app/`)
- Progress tracking (`прогресс_работы.md`)

### Related KineLab Repositories

- [KineLab-Elixir](https://github.com/KineLab/KineLab-Elixir) - Main Phoenix application (Elixir backend + Svelte frontend)
- [KineLab-Workers](https://github.com/KineLab/KineLab-Workers) - Rust microservices for AI/media processing
- [KineLab-Docs](https://github.com/KineLab/KineLab-Docs) - Project documentation

## Key Files

- `прогресс_работы.md` - Progress tracker, read this first to understand current learning status
- `руководства.md` - Teaching guidelines for AI assistants
- `структура_проекта.md` - KineLab architecture overview
- `learning_app/AGENTS.md` - Phoenix/Elixir development guidelines (comprehensive)

## Learning App Commands

The `learning_app/` directory contains a Phoenix 1.8 application with Svelte integration.

### Setup
```bash
cd learning_app
mix setup  # Install deps, create DB, setup assets
```

### Development
```bash
mix phx.server              # Start Phoenix server on localhost:4000
iex -S mix phx.server       # Start with interactive shell
```

### Testing & Quality
```bash
mix test                    # Run tests
mix precommit               # Run before committing: compile, format, test
```

### Database
```bash
mix ecto.create             # Create database
mix ecto.migrate            # Run migrations
mix ecto.reset              # Drop, create, migrate, seed
```

### Assets (Vite + Svelte)
```bash
cd assets
npm install                 # Install frontend dependencies
npm run build               # Build assets once
npm run watch               # Watch and rebuild assets
```

## Architecture Notes

### Phoenix + Svelte Integration

The `learning_app` demonstrates the architecture used in KineLab-Elixir:

1. **Phoenix LiveView as "Host"**: LiveView manages server-side state and WebSocket connections
2. **Svelte for UI**: Interactive components are built with Svelte (located in `assets/js/svelte/`)
3. **JS Hooks as "Glue"**: Communication between Phoenix and Svelte happens through Phoenix Hooks and `pushEvent`/`handleEvent`

Example flow:
```elixir
# LiveView (Elixir side)
def handle_event("user_action", params, socket) do
  {:noreply, push_event(socket, "update_svelte", %{data: "..."})}
end
```

```javascript
// Hook (JavaScript side)
Hooks.MyHook = {
  mounted() {
    this.handleEvent("update_svelte", ({data}) => {
      // Update Svelte component
    })
  }
}
```

### Technology Stack

**Backend:**
- Elixir ~> 1.15
- Phoenix ~> 1.8.1
- Phoenix LiveView ~> 1.1.0
- Ecto + SQLite (ecto_sqlite3)
- Req for HTTP requests (NOT httpoison/tesla)

**Frontend:**
- Svelte ~> 4.2.0
- Vite ~> 5.0.0 (build tool)
- Tailwind CSS v4 (utility-first CSS)
- Heroicons (icons)

**Queue:**
- Oban (for background jobs in KineLab-Elixir, not used in learning_app)

## Development Guidelines

### Critical Phoenix v1.8 Rules

From `learning_app/AGENTS.md`:

1. **LiveView templates**: Always begin with `<Layouts.app flash={@flash} ...>`
2. **Icons**: Use `<.icon name="hero-x-mark" />` component, never Heroicons modules directly
3. **Forms**: Always use `to_form/2` and `<.input>` component from `core_components.ex`
4. **Navigation**: Use `<.link navigate={}>` and `push_navigate`, NOT deprecated `live_redirect`
5. **Streams**: Use LiveView streams for collections, NOT regular list assigns

### Elixir Gotchas

- Lists do NOT support index access: use `Enum.at(list, i)` not `list[i]`
- Variables are immutable but rebindable: bind expression results properly
- Structs don't implement Access: use `struct.field` not `struct[:field]`
- No `else if`: use `cond` or `case` for multiple conditions

### HEEx Template Rules

- Block expressions use `<%= ... %>`, values in attributes use `{...}`
- Class lists must use array syntax: `class={["px-2", @flag && "py-5"]}`
- NO inline `<script>` tags: put JS in `assets/js/` and import in `app.js`

### Asset Handling

- Tailwind v4 uses new import syntax in `app.css` - maintain the `@import "tailwindcss"` format
- Vendor scripts must be imported in `app.js`, NOT linked in layouts
- Vite is the build tool (NOT esbuild alone)

## Database

Uses SQLite (ecto_sqlite3) for simplicity during learning. Production KineLab-Elixir uses PostgreSQL.

Database files (when server is running):
- `learning_app_dev.db`
- `learning_app_dev.db-shm`
- `learning_app_dev.db-wal`

## Progress Tracking

When completing lessons, update `прогресс_работы.md` to track progress and note blockers/questions.

## Teaching Context

When acting as AI tutor (per `руководства.md`):
1. Read `прогресс_работы.md` at session start
2. Use professional, direct language - avoid theatrical analogies
3. Follow structure: What → How → Why → Example
4. Add term definitions in parentheses for clarity
5. Provide concrete code examples, not abstract explanations
