---
description: Generate production-grade tests with TestGen using the shared review-first JSON contract
---

Use TestGen for repo-local test generation, test coverage work, and validation tasks.

TestGen gives OpenCode a repeatable workflow instead of a loose prompt: analyze the repo, detect existing test style, generate reviewable patches, then validate only when writing is allowed.

## Rules

1. Run analysis before broad generation.
2. Use dry-run patches first.
3. Parse the JSON envelope, especially `results`, `artifacts`, `patches`, `success_count`, `error_count`, and usage fields.
4. Follow TestGen's detected framework, fixtures, mocks, naming, and assertion style.
5. Do not write files until the dry-run patch has been inspected, unless the user explicitly asks for direct writes.
6. Validate after writing whenever the project has a runnable test command.

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

Analyze first:

```bash
testgen analyze --path "${ARGUMENTS:-.}" --cost-estimate --output-format json
```

Generate review-first patches for a directory:

```bash
testgen generate --path "${ARGUMENTS:-.}" \
  --recursive \
  --type=unit \
  --dry-run \
  --emit-patch \
  --report-usage \
  --output-format json
```

Generate review-first patches for one file:

```bash
testgen generate --file "$ARGUMENTS" \
  --type=unit \
  --dry-run \
  --emit-patch \
  --report-usage \
  --output-format json
```

Write only after review or explicit user approval:

```bash
testgen generate --path "${ARGUMENTS:-.}" --recursive --type=unit --validate --output-format json
```

Summarize the generated tests, validation result, and any files that still need manual attention.
