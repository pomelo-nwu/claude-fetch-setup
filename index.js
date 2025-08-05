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
                cwd: this.mcpDir 
            });
            
            console.log('📦 Installing dependencies...');
            execSync('npm install', {
                stdio: 'inherit',
                cwd: this.fetchMcpDir
            });
            
            console.log('🔨 Building fetch-mcp...');
            execSync('npm run build', {
                stdio: 'inherit',
                cwd: this.fetchMcpDir
            });
            
            return true;
        } catch (error) {
            console.error('❌ Error during fetch-mcp setup:', error.message);
            return false;
        }
    }

    async configureClaude() {
        console.log('⚙️  Configuring Claude MCP...');
        
        try {
            const indexPath = path.join(this.fetchMcpDir, 'dist', 'index.js');
            
            if (!fs.existsSync(indexPath)) {
                throw new Error(`Built index.js not found at ${indexPath}`);
            }
            
            const mcpAddCommand = `claude mcp add fetch node "${indexPath}" --scope user`;
            execSync(mcpAddCommand, { 
                stdio: 'inherit'
            });
            
            console.log('✅ Claude MCP configuration completed!');
            return true;
        } catch (error) {
            console.error('❌ Error configuring Claude MCP:', error.message);
            console.log('💡 You may need to run this command manually:');
            console.log(`   claude mcp add fetch node "${path.join(this.fetchMcpDir, 'dist', 'index.js')}" --scope user`);
            return false;
        }
    }

    async run() {
        console.log('🚀 Claude Fetch MCP Installer');
        console.log('================================');
        
        try {
            const needsSetup = await this.checkAndCreateMcpDirectory();
            
            if (!needsSetup) {
                console.log('✅ fetch-mcp already exists at ~/.claude-custom-mcp/fetch-mcp');
                console.log('💡 If you want to reinstall, please remove the directory first.');
                return;
            }
            
            const setupSuccess = await this.cloneAndSetupFetchMcp();
            if (!setupSuccess) {
                process.exit(1);
            }
            
            const configSuccess = await this.configureClaude();
            
            console.log('\n🎉 Installation completed!');
            console.log('📖 The fetch MCP is now available for Claude Code.');
            console.log('🔄 You may need to restart Claude Code to see the changes.');
            
            if (!configSuccess) {
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