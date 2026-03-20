set shell := ["bash", "-cu"]

default:
  @just --list

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
