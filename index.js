#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

class ClaudeFetchMCPInstaller {
  constructor() {
    this.homeDir = os.homedir();
    this.mcpDir = path.join(this.homeDir, '.claude-custom-mcp');
    this.fetchMcpDir = path.join(this.mcpDir, 'fetch-mcp');
  }

  async checkAndCreateMcpDirectory() {
    console.log('📁 Checking for Claude MCP directory...');

    if (!fs.existsSync(this.mcpDir)) {
      console.log('📁 Creating ~/.claude-custom-mcp directory...');
      await fs.ensureDir(this.mcpDir);
    }

    return !fs.existsSync(this.fetchMcpDir);
  }

  async cloneAndSetupFetchMcp() {
    console.log('📦 Cloning fetch-mcp repository...');

    try {
      const cloneCommand = `git clone https://github.com/zcaceres/fetch-mcp.git "${this.fetchMcpDir}"`;
      execSync(cloneCommand, {
        stdio: 'inherit',
        cwd: this.mcpDir,
      });

      console.log('📦 Installing dependencies...');
      execSync('npm install', {
        stdio: 'inherit',
        cwd: this.fetchMcpDir,
      });

      console.log('🔨 Building fetch-mcp...');
      execSync('npm run build', {
        stdio: 'inherit',
        cwd: this.fetchMcpDir,
      });

      return true;
    } catch (error) {
      console.error('❌ Error during fetch-mcp setup:', error.message);
      return false;
    }
  }

  configureClaude() {
    console.log('⚙️  Configuring Claude MCP...');

    try {
      const indexPath = path.join(this.fetchMcpDir, 'dist', 'index.js');

      if (!fs.existsSync(indexPath)) {
        throw new Error(`Built index.js not found at ${indexPath}`);
      }

      const mcpAddCommand = `claude mcp add fetch node "${indexPath}" --scope user`;
      execSync(mcpAddCommand, {
        stdio: 'inherit',
      });

      console.log('✅ Claude MCP configuration completed!');
      return true;
    } catch (error) {
      console.error('❌ Error configuring Claude MCP:', error.message);
      console.log('💡 You may need to run this command manually:');
      console.log(
        `   claude mcp add fetch node "${path.join(
          this.fetchMcpDir,
          'dist',
          'index.js'
        )}" --scope user`
      );
      return false;
    }
  }

  async setupGlobalClaudeMd() {
    console.log('📝 Setting up global CLAUDE.md file...');

    try {
      const claudeDir = path.join(this.homeDir, '.claude');
      const claudeMdPath = path.join(claudeDir, 'CLAUDE.md');
      const claudeMdContent = `# Project Tool Preferences

Please use fetch-mcp instead of Fetch and WebFetch tools!`;

      // 确保 .claude 目录存在
      await fs.ensureDir(claudeDir);

      // 检查文件是否存在
      if (fs.existsSync(claudeMdPath)) {
        console.log('📝 CLAUDE.md already exists, checking content...');
        const existingContent = await fs.readFile(claudeMdPath, 'utf8');

        // 检查是否已经包含 fetch-mcp 相关的内容
        if (existingContent.includes('fetch-mcp')) {
          console.log('✅ CLAUDE.md already contains fetch-mcp configuration');
          return true;
        } else {
          // 追加 fetch-mcp 配置
          const updatedContent =
            existingContent +
            '\n\nPlease use fetch-mcp instead of Fetch and WebFetch tools!';
          await fs.writeFile(claudeMdPath, updatedContent, 'utf8');
          console.log(
            '✅ Updated existing CLAUDE.md with fetch-mcp configuration'
          );
        }
      } else {
        // 创建新的 CLAUDE.md 文件
        await fs.writeFile(claudeMdPath, claudeMdContent, 'utf8');
        console.log(
          '✅ Created new CLAUDE.md file with fetch-mcp configuration'
        );
      }

      return true;
    } catch (error) {
      console.error('❌ Error setting up CLAUDE.md:', error.message);
      return false;
    }
  }

  async run() {
    console.log('🚀 Claude Fetch MCP Installer');
    console.log('================================');

    try {
      const needsSetup = await this.checkAndCreateMcpDirectory();

      if (!needsSetup) {
        console.log(
          '✅ fetch-mcp already exists at ~/.claude-custom-mcp/fetch-mcp'
        );
        console.log(
          '💡 If you want to reinstall, please remove the directory first.'
        );
        console.log('📝 Checking CLAUDE.md configuration...');
      } else {
        const setupSuccess = await this.cloneAndSetupFetchMcp();
        if (!setupSuccess) {
          process.exit(1);
        }

        const configSuccess = this.configureClaude();
        if (!configSuccess) {
          process.exit(1);
        }
      }

      // 设置全局 CLAUDE.md 文件
      const claudeMdSuccess = await this.setupGlobalClaudeMd();

      console.log('\n🎉 Installation completed!');
      console.log('📖 The fetch MCP is now available for Claude Code.');
      console.log('📝 Global CLAUDE.md file has been configured.');
      console.log('🔄 You may need to restart Claude Code to see the changes.');

      if (!claudeMdSuccess) {
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Installation failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the installer
if (require.main === module) {
  const installer = new ClaudeFetchMCPInstaller();
  installer.run().catch(console.error);
}

module.exports = ClaudeFetchMCPInstaller;
