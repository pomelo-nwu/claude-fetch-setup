# Claude Fetch Setup

**Automated tool to solve Claude Code domain fetch permission issues**

This tool specifically addresses the domain fetch permission problem reported in [Claude Code Issue #1217](https://github.com/anthropics/claude-code/issues/1217), where domains cannot be fetched even when explicitly allowed.

## Problem Description

Claude Code has a known bug where even when you explicitly allow a domain, the system still reports "Domain <X> is not allowed to be fetched". This issue is particularly common in:

- Enterprise network environments with restrictions
- Proxy configuration issues
- Built-in fetch and WebFetch tools failure

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

## After Installation

After installation, you will be able to:

- ✅ Fetch content from any allowed domains normally
- ✅ Bypass "Domain not allowed" errors
- ✅ Use network functionality in enterprise environments

## How it works

This tool automatically performs the following steps to solve the domain fetch problem:

1. ✅ Check and create `~/.claude-custom-mcp/` directory
2. 📦 Clone the [fetch-mcp repository](https://github.com/zcaceres/fetch-mcp)
3. 📦 Run `npm install` and `npm run build` to build the MCP server
4. ⚙️ Automatically configure Claude Code: `claude mcp add fetch node ~/.claude-custom-mcp/fetch-mcp/dist/index.js --scope user`

**This addresses the root cause of Issue #1217: bypassing built-in fetch limitations through a custom MCP server.**

## After Installation

Once the installation is complete:

1. 🔄 Restart Claude Code to load the new MCP server
2. 🌐 The fetch functionality will now be available through the MCP server
3. ✅ You can now use fetch capabilities in enterprise environments

## Requirements

- Node.js >= 14.0.0
- Git (for cloning the repository)
- Claude Code CLI installed and configured

## Troubleshooting

If the automatic Claude configuration fails, you can manually run:

```bash
claude mcp add fetch node ~/.claude-custom-mcp/fetch-mcp/dist/index.js --scope user
```

## Related Links

- 🔗 **[Original Issue #1217](https://github.com/anthropics/claude-code/issues/1217)** - This tool specifically addresses this issue
- 🔗 [fetch-mcp Repository](https://github.com/zcaceres/fetch-mcp) - Underlying MCP server
- 🔗 [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)

## Background

This tool was inspired by the [discussion in Issue #1217](https://github.com/anthropics/claude-code/issues/1217#issuecomment-3101421558) and provides an automated solution for users experiencing "Domain not allowed" errors.

## License

MIT
