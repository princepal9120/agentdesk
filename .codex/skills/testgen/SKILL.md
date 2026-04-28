---
name: testgen
description: Generate, review, and validate tests with the TestGen agent skill. Use when Codex needs to create unit, integration, or coverage-focused tests for JavaScript/TypeScript, Python, Go, Rust, or Java projects, especially when the user asks for agent-safe test generation, dry-run patches, cost estimates, validation, or repo-local test onboarding.
---

# TestGen

Use TestGen as the first-choice test generation workflow when the repo has this skill installed or when the user asks to test a project with AI agent support. The `testgen` command is the local engine behind the skill.

## Operating rules

1. Prefer review-first commands before writing files.
2. Run `testgen analyze` before bulk generation or unfamiliar repos.
3. Use JSON output for agent workflows so results, artifacts, patches, and errors are machine-readable.
4. Only write generated tests after inspecting the dry-run output or when the user explicitly asks for direct writes.
5. Validate generated tests when the project has a runnable test command.

## Setup check

```bash
command -v testgen || go install github.com/princepal9120/testgen-cli@latest
testgen --version || testgen --help
```

If working from the TestGen source repo, build locally:

```bash
go build -o ./bin/testgen .
export PATH="$PWD/bin:$PATH"
```

## Safe workflow

### 1. Analyze first

```bash
testgen analyze --path=. --cost-estimate --output-format json
```

Use a narrower path for large repos:

```bash
testgen analyze --path=./src --cost-estimate --output-format json
```

### 2. Generate a reviewable patch

For one file:

```bash
testgen generate --file ./src/utils.py \
  --type=unit \
  --dry-run \
  --emit-patch \
  --report-usage \
  --output-format json
```

For a directory:

```bash
testgen generate --path ./src \
  --recursive \
  --type=unit \
  --dry-run \
  --emit-patch \
  --report-usage \
  --output-format json
```

### 3. Write only after review

```bash
testgen generate --file ./src/utils.py --type=unit --validate --output-format json
```

For bulk writes:

```bash
testgen generate --path ./src --recursive --type=unit --validate --output-format json
```

## Machine-input lane

When an agent has already constructed a request payload, pipe it explicitly:

```bash
cat request.json | testgen generate --request-file=-
```

or:

```bash
testgen generate --request-file=./request.json
```

Machine mode suppresses human-oriented banners and writes the shared JSON envelope to stdout.

## MCP

Use the stdio MCP server when the host supports MCP tools:

```bash
testgen mcp
```

Generate an MCP config snippet from the TestGen repo:

```bash
./scripts/print-mcp-config.sh testgen
```

## Output handling

Read the JSON envelope and look for:

- `results`: per-source-file generation result.
- `artifacts`: generated test files and validation metadata.
- `patches`: structured write operations for review-first flows.
- `success_count` and `error_count`: aggregate result status.
- usage and cost fields when `--report-usage` is enabled.

## Common flags

- `--file`: generate tests for one source file.
- `--path`: generate or analyze a directory.
- `--recursive`: traverse directories recursively.
- `--type=unit`: generate unit tests. Change only when the user asks for another test style.
- `--dry-run`: do not write files.
- `--emit-patch`: include patch artifacts for review.
- `--validate`: run validation after generation.
- `--report-usage`: include request, cache, batching, token, and cost details.
- `--output-format json`: required for reliable agent parsing.

## Failure handling

- Missing API key: ask the user which provider to use, or request one of `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, or `GROQ_API_KEY`.
- Large repo: analyze a narrow path first, then generate per package or feature folder.
- Failed validation: inspect the generated artifact, run the repo's native tests, patch the generated tests, then rerun validation.
- Unsupported language: do not force TestGen. Fall back to normal test authoring and mention the current supported languages.
