# Contributing Guide

Thank you for considering contributing to Fix-It-Fast! This guide helps you be productive and consistent.

## Workflow

- Fork and clone the repository.
- Create a feature branch: `feat/<short-topic>` or `fix/<short-topic>`.
- Keep changes focused and small.
- Open a pull request describing motivation, approach, and testing.

## Development Standards

- TypeScript strictness — avoid `any` unless necessary.
- Keep components small; co-locate styles and hooks.
- Follow existing Mantine/Tailwind patterns.
- Prefer React Query over manual fetch for client-side data.

## Code Style

- Run `yarn lint` and `yarn typecheck` before pushing.
- Maintain consistent naming and file organization.
- Avoid commented-out code or dead code.

## Testing

- Add unit tests where feasible (utilities, stores, API helpers).
- For UI, consider Storybook if introduced; otherwise, focus on logical tests.

## Security & Secrets

- Never commit `.env` values or secrets.
- Use environment variables and secret stores.

## Documentation

- Update `docs/` when introducing significant features or changes.
- Add usage examples and rationale for architectural decisions.

## Release Hygiene

- Update changelog (if present) and bump version where applicable.
- Validate build and PWA behavior on a fresh environment.