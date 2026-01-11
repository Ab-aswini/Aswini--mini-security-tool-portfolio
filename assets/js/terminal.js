/**
 * Command Center (CLI)
 * Hacker-style terminal overlay for power users.
 * Trigger: Ctrl+K
 */

const COMMANDS = {
    help: "Available commands: help, clear, goto <page>, theme <light|dark>, whoami, exit",
    clear: "CLEAR_BUFFER",
    whoami: "guest@universe-v1",
    about: "Navigating to /about.html...",
    projects: "Navigating to /projects.html...",
    universe: "Navigating to /universe.html...",
    tools: "Navigating to /tools.html...",
    exit: "Closing terminal..."
};

const PAGES = {
    home: "index.html",
    about: "about.html",
    projects: "projects.html",
    universe: "universe.html",
    tools: "tools.html",
    contact: "contact.html",
    failures: "failures.html"
};

class Terminal {
    constructor() {
        this.isOpen = false;
        this.overlay = null;
        this.input = null;
        this.output = null;
        this.history = [];
        this.historyIndex = -1;

        this.init();
    }

    init() {
        // Create DOM structure if it doesn't exist
        if (!document.getElementById('cli-overlay')) {
            this.createOverlay();
        }

        this.overlay = document.getElementById('cli-overlay');
        this.input = document.getElementById('cli-input');
        this.output = document.getElementById('cli-output');

        // Event Listeners
        document.addEventListener('keydown', (e) => this.handleGlobalKey(e));
        this.input.addEventListener('keydown', (e) => this.handleInputKey(e));

        // Focus input when clicking anywhere on overlay
        this.overlay.addEventListener('click', () => this.input.focus());
    }

    createOverlay() {
        const div = document.createElement('div');
        div.id = 'cli-overlay';
        div.className = 'hidden';
        div.innerHTML = `
            <div class="cli-container">
                <div class="cli-header">
                    <span>root@universe:~#</span>
                    <span class="cli-controls">ESC to close</span>
                </div>
                <div id="cli-output">
                    <div class="cli-line text-muted">Initialize sequence... v1.0.4 loaded.</div>
                    <div class="cli-line text-accent">Welcome to the Command Center. Type 'help' for instructions.</div>
                </div>
                <div class="cli-input-line">
                    <span class="prompt">$</span>
                    <input type="text" id="cli-input" autocomplete="off" spellcheck="false">
                </div>
            </div>
        `;
        document.body.appendChild(div);
    }

    handleGlobalKey(e) {
        // Toggle on Ctrl+K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.toggle();
        }
        // Close on ESC
        if (this.isOpen && e.key === 'Escape') {
            this.toggle();
        }
    }

    handleInputKey(e) {
        if (e.key === 'Enter') {
            const cmd = this.input.value.trim();
            this.processCommand(cmd);
            this.input.value = '';
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.overlay.classList.toggle('hidden');
        if (this.isOpen) {
            this.input.focus();
            document.body.style.overflow = 'hidden'; // Lock scroll
        } else {
            document.body.style.overflow = '';
        }
    }

    processCommand(rawCmd) {
        if (!rawCmd) return;

        this.print(`$ ${rawCmd}`);

        const args = rawCmd.toLowerCase().split(' ');
        const cmd = args[0];

        // Specific Logic
        if (cmd === 'clear') {
            this.output.innerHTML = '';
            return;
        }

        if (cmd === 'exit') {
            this.toggle();
            return;
        }

        if (cmd === 'goto') {
            const page = args[1];
            if (PAGES[page]) {
                this.print(`> Jumping to ${page}...`, 'text-accent');
                setTimeout(() => window.location.href = PAGES[page], 500);
            } else {
                this.print(`> Error: Page '${page}' not found. Try: home, about, projects...`, 'text-error');
            }
            return;
        }

        if (cmd === 'theme') {
            const mode = args[1];
            if (mode === 'light' || mode === 'dark') {
                document.documentElement.setAttribute('data-theme', mode);
                localStorage.setItem('theme', mode);
                this.print(`> Theme set to ${mode}.`);
            } else {
                this.print(`> Usage: theme <light|dark>`);
            }
            return;
        }

        // Static Commands
        if (COMMANDS[cmd]) {
            this.print(`> ${COMMANDS[cmd]}`);

            // Handle nav shortcuts defined in COMMANDS (optional shorthand)
            if (cmd === 'about') setTimeout(() => window.location.href = PAGES.about, 500);
            if (cmd === 'projects') setTimeout(() => window.location.href = PAGES.projects, 500);
            if (cmd === 'universe') setTimeout(() => window.location.href = PAGES.universe, 500);

            return;
        }

        this.print(`> Command not found: ${cmd}. Type 'help'.`, 'text-muted');
    }

    print(text, className = '') {
        const div = document.createElement('div');
        div.className = `cli-line ${className}`;
        div.textContent = text;
        this.output.appendChild(div);
        // Auto scroll
        this.overlay.querySelector('.cli-container').scrollTop = this.output.scrollHeight;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});
