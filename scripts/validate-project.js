const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function runCommand(command, args, name) {
    return new Promise((resolve, reject) => {
        console.log(`${colors.cyan}Starting ${name}...${colors.reset}`);
        const startTime = Date.now();

        const proc = spawn(command, args, {
            stdio: 'inherit',
            shell: true,
        });

        proc.on('close', (code) => {
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            if (code === 0) {
                console.log(`${colors.green}✔ ${name} passed in ${duration}s${colors.reset}\n`);
                resolve();
            } else {
                console.error(`${colors.red}✘ ${name} failed with exit code ${code}${colors.reset}\n`);
                reject(new Error(`${name} failed`));
            }
        });

        proc.on('error', (err) => {
            console.error(`${colors.red}✘ ${name} failed to start: ${err.message}${colors.reset}\n`);
            reject(err);
        });
    });
}

async function main() {
    console.log(`${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.blue}   SwenAutos Project Validation Script   ${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}\n`);

    const results = {
        build: 'pending',
        contracts: 'pending',
        ui: 'pending',
    };

    try {
        // 1. Build the Next.js Application
        try {
            await runCommand('npm', ['run', 'build'], 'Next.js Build');
            results.build = 'success';
        } catch (e) {
            results.build = 'failed';
        }

        // 2. Test Smart Contracts
        try {
            await runCommand('npm', ['run', 'test'], 'Smart Contract Tests');
            results.contracts = 'success';
        } catch (e) {
            results.contracts = 'failed';
        }

        // 3. Test UI Components
        try {
            // Using 'vitest run' to ensure it runs once and exits
            await runCommand('npx', ['vitest', 'run'], 'UI Tests');
            results.ui = 'success';
        } catch (e) {
            results.ui = 'failed';
        }

        // Summary
        console.log(`${colors.blue}========================================${colors.reset}`);
        console.log(`${colors.blue}           Validation Summary           ${colors.reset}`);
        console.log(`${colors.blue}========================================${colors.reset}`);

        console.log(`Build:            ${results.build === 'success' ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset}`);
        console.log(`Smart Contracts:  ${results.contracts === 'success' ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset}`);
        console.log(`UI Tests:         ${results.ui === 'success' ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset}`);

        if (Object.values(results).some(r => r === 'failed')) {
            process.exit(1);
        } else {
            process.exit(0);
        }

    } catch (error) {
        console.error(`${colors.red}Unexpected error: ${error.message}${colors.reset}`);
        process.exit(1);
    }
}

main();
