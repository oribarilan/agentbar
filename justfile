set shell := ["bash", "-cu"]

default:
  @just --list

dev:
  if command -v cargo-tauri >/dev/null 2>&1; then pnpm --filter @agentbar/app exec cargo tauri dev --manifest-path src-tauri/Cargo.toml; else pnpm --dir packages/app dlx @tauri-apps/cli dev --config '{"build":{"beforeDevCommand":"pnpm --filter @agentbar/app dev"}}'; fi

lint:
  pnpm run lint

format:
  pnpm run format

test:
  pnpm run test

check:
  just lint
  just format
  just test
