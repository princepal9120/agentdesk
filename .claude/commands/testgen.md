---
description: Generate production-grade tests with TestGen using the shared review-first JSON contract
---

Use TestGen when the user asks Claude Code to generate, improve, validate, or increase tests for a file or path.

TestGen is the repo-local test-generation workflow. Do not replace it with a loose prompt unless the language is unsupported or the `testgen` engine is unavailable.

## Rules

1. Analyze before bulk generation or unfamiliar repos.
2. Prefer dry-run patches before file writes.
3. Read the JSON result. Use `results`, `artifacts`, `patches`, `success_count`, `error_count`, and usage fields instead of scraping prose.
4. Let TestGen adapt to existing test files. Do not hard-code a different framework unless the user asks.
5. Write files only after inspecting the dry-run output or when the user explicitly asks for direct writes.
6. Validate with the project test command when available.

## Setup check

```bash
command -v testgen || go install github.com/princepal9120/testgen-cli@latest
testgen --version || testgen --help
```

If working inside the TestGen source repo:

```bash
go build -o ./bin/testgen .
export PATH="$PWD/bin:$PATH"
```

## Safe workflow

For a directory or unfamiliar codebase, start here:

```bash
testgen analyze --path "${ARGUMENTS:-.}" --cost-estimate --output-format json
```

Generate review-first patches:

```bash
testgen generate --path "${ARGUMENTS:-.}" \
  --recursive \
  --type=unit \
  --dry-run \
  --emit-patch \
  --report-usage \
  --output-format json
```

For a single file, use `--file` instead of `--path`:

```bash
testgen generate --file "$ARGUMENTS" \
  --type=unit \
  --dry-run \
  --emit-patch \
  --report-usage \
  --output-format json
```

When the patch is acceptable or the user asked to write files directly:

```bash
testgen generate --path "${ARGUMENTS:-.}" --recursive --type=unit --validate --output-format json
```

Report what changed, which tests were generated, validation status, and any remaining blockers.
