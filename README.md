# Claude Fetch Setup

## Background

This tool was inspired by the [discussion in Issue #1217](https://github.com/anthropics/claude-code/issues/1217#issuecomment-3101421558) and provides an automated solution for users experiencing "Domain not allowed" errors.

**Error Example:**

```
⏺ Fetch(https://zod.dev/v4)…
⎿ Error: Domain zod.dev is not allowed to be fetched
```

## Solution

This tool bypasses this limitation by automatically setting up [fetch-mcp](https://github.com/zcaceres/fetch-mcp) as a custom MCP server, providing stable network fetch functionality.

## Quick Installation

### One-click install (Recommended)

```bash
npx claude-fetch-setup
```

### Global installation

```bash
npm install -g claude-fetch-setup
claude-fetch-setup
```

## After installation

After installation, run the following command to verify that fetch-mcp has been successfully added to your MCP list:

```bash
claude mcp list
cat ~/.claude/CLAUDE.md
```

## How it works

This tool automatically performs the following steps to solve the domain fetch problem:

1. ✅ Check and create `~/.claude-custom-mcp/` directory
2. 📦 Clone the [fetch-mcp repository](https://github.com/zcaceres/fetch-mcp)
3. 📦 Run `npm install` and `npm run build` to build the MCP server
4. ⚙️ Automatically configure Claude Code: `claude mcp add fetch node ~/.claude-custom-mcp/fetch-mcp/dist/index.js --scope user`
5. 📝 Configure global `CLAUDE.md` file in `~/.claude/` directory to ensure fetch-mcp is used instead of built-in fetch tools

## Related Links

- 🔗 **[Original Issue #1217](https://github.com/anthropics/claude-code/issues/1217)** - This tool specifically addresses this issue
- 🔗 [fetch-mcp Repository](https://github.com/zcaceres/fetch-mcp) - Underlying MCP server
- 🔗 [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)

## License

MIT
