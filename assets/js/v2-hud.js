/**
 * V2 Cyber Suite Telemetry & Command Palette (Ctrl+K)
 * Real-time HUD telemetry ticker & interactive command modal overlay.
 */

(function () {
    document.addEventListener("DOMContentLoaded", () => {
        initTelemetry();
        initCommandPalette();
    });

    // -------------------------------------------------------------
    // 1. Live Telemetry HUD Ticker
    // -------------------------------------------------------------
    async function initTelemetry() {
        const hudElements = document.querySelectorAll(".v2-hud-bar");
        if (hudElements.length === 0) return;

        let clientIp = "Resolving...";
        let pingMs = "--";

        // Fetch IP
        try {
            const start = performance.now();
            const res = await fetch("https://api.ipify.org?format=json");
            if (res.ok) {
                const data = await res.json();
                clientIp = data.ip || "127.0.0.1";
                pingMs = Math.round(performance.now() - start) + "ms";
            }
        } catch (err) {
            clientIp = "127.0.0.1 (Local)";
        }

        // Live Clock
        function updateHud() {
            const now = new Date();
            const utcTime = now.toISOString().slice(11, 19) + " UTC";

            hudElements.forEach((bar) => {
                bar.innerHTML = `
                    <span class="v2-hud-item"><span class="v2-hud-dot"></span> SECURE</span>
                    <span class="v2-hud-item">IP: ${clientIp}</span>
                    <span class="v2-hud-item">PING: ${pingMs}</span>
                    <span class="v2-hud-item">${utcTime}</span>
                `;
            });
        }

        updateHud();
        setInterval(updateHud, 1000);
    }

    // -------------------------------------------------------------
    // 2. Global Command Palette Overlay (Ctrl + K)
    // -------------------------------------------------------------
    const COMMANDS = [
        { id: "home", title: "Go to Overview Hub", category: "Navigation", icon: "home", url: "index.html" },
        { id: "tools", title: "Open Tools Suite Matrix", category: "Navigation", icon: "grid", url: "tools.html" },
        { id: "projects", title: "View Built Systems & Projects", category: "Navigation", icon: "folder", url: "projects.html" },
        { id: "universe", title: "Explore Universe Portfolio", category: "Navigation", icon: "globe", url: "universe.html" },
        { id: "cyber-forge", title: "CyberForge Cryptography & Payload Studio", category: "Security Tools", icon: "binary", url: "tools/cyber-forge.html" },
        { id: "ip-intel", title: "IP & Network Intelligence", category: "Security Tools", icon: "wifi", url: "tools/ip-intel.html" },
        { id: "exif", title: "Image EXIF Metadata Visualizer", category: "Security Tools", icon: "camera", url: "tools/image-exif.html" },
        { id: "breach", title: "Data Breach Exposure Checker", category: "Security Tools", icon: "shield-alert", url: "tools/breach-checker.html" },
        { id: "pwd", title: "Password Entropy & Strength", category: "Security Tools", icon: "lock", url: "tools/password-strength.html" },
        { id: "fp", title: "Browser Fingerprint Inspector", category: "Security Tools", icon: "fingerprint", url: "tools/browser-fingerprint.html" },
        { id: "theme", title: "Toggle Light / Dark Mode", category: "Actions", icon: "moon", action: toggleTheme }
    ];

    function initCommandPalette() {
        let modalOverlay = document.getElementById("v2-cmd-overlay");
        if (!modalOverlay) {
            modalOverlay = document.createElement("div");
            modalOverlay.id = "v2-cmd-overlay";
            modalOverlay.className = "v2-cmd-modal-overlay";
            modalOverlay.innerHTML = `
                <div class="v2-cmd-modal">
                    <div class="v2-cmd-header">
                        <i data-lucide="terminal" style="width:20px; color:var(--cyber-blue);"></i>
                        <input type="text" id="v2-cmd-input" class="v2-cmd-input" placeholder="Type a command or search tools (e.g. IP, EXIF, Theme)..." autocomplete="off" />
                        <span class="v2-kbd">ESC</span>
                    </div>
                    <div class="v2-cmd-body" id="v2-cmd-results"></div>
                    <div class="v2-cmd-footer">
                        <span>Use <span class="v2-kbd">&uarr;</span> <span class="v2-kbd">&darr;</span> to navigate, <span class="v2-kbd">&crarr;</span> to select</span>
                        <span>V2 Cyber Suite Command</span>
                    </div>
                </div>
            `;
            document.body.appendChild(modalOverlay);
        }

        const input = document.getElementById("v2-cmd-input");
        const resultsContainer = document.getElementById("v2-cmd-results");
        let selectedIndex = 0;
        let filteredCommands = [...COMMANDS];

        function renderResults() {
            if (filteredCommands.length === 0) {
                resultsContainer.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-dim);">No matching commands found.</div>`;
                return;
            }

            let html = "";
            let currentCat = "";

            filteredCommands.forEach((cmd, idx) => {
                if (cmd.category !== currentCat) {
                    currentCat = cmd.category;
                    html += `<div class="v2-cmd-group-title">${currentCat}</div>`;
                }

                const isSelected = idx === selectedIndex ? "selected" : "";
                html += `
                    <div class="v2-cmd-item ${isSelected}" data-idx="${idx}">
                        <div class="v2-cmd-item-left">
                            <i data-lucide="${cmd.icon || 'terminal'}" style="width:16px; height:16px; color:var(--cyber-blue);"></i>
                            <span>${cmd.title}</span>
                        </div>
                        <span class="v2-kbd">SELECT</span>
                    </div>
                `;
            });

            resultsContainer.innerHTML = html;

            if (window.lucide) {
                window.lucide.createIcons();
            }

            // Click listeners
            resultsContainer.querySelectorAll(".v2-cmd-item").forEach((el) => {
                el.addEventListener("click", () => {
                    const idx = parseInt(el.getAttribute("data-idx"));
                    executeCommand(filteredCommands[idx]);
                });
            });
        }

        function openPalette() {
            modalOverlay.classList.add("active");
            input.value = "";
            selectedIndex = 0;
            filteredCommands = [...COMMANDS];
            renderResults();
            setTimeout(() => input.focus(), 50);
        }

        function closePalette() {
            modalOverlay.classList.remove("active");
        }

        function executeCommand(cmd) {
            closePalette();
            if (!cmd) return;
            if (cmd.action) {
                cmd.action();
            } else if (cmd.url) {
                const scripts = document.querySelectorAll('script[src*="component-loader.js"]');
                let prefix = "";
                if (scripts.length > 0) {
                    const src = scripts[0].getAttribute("src") || "";
                    const count = (src.match(/\.\.\//g) || []).length;
                    prefix = "../".repeat(count);
                }
                window.location.href = prefix + cmd.url;
            }
        }

        // Global Keydown Listeners
        window.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (modalOverlay.classList.contains("active")) {
                    closePalette();
                } else {
                    openPalette();
                }
            } else if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
                closePalette();
            }
        });

        // Click outside modal
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                closePalette();
            }
        });

        // Filter Input
        input.addEventListener("input", () => {
            const query = input.value.toLowerCase().trim();
            if (!query) {
                filteredCommands = [...COMMANDS];
            } else {
                filteredCommands = COMMANDS.filter(
                    (c) => c.title.toLowerCase().includes(query) || c.category.toLowerCase().includes(query)
                );
            }
            selectedIndex = 0;
            renderResults();
        });

        // Key Navigation
        input.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % filteredCommands.length;
                renderResults();
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
                renderResults();
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    executeCommand(filteredCommands[selectedIndex]);
                }
            }
        });

        // Attach palette triggers if present
        document.querySelectorAll(".v2-cmd-trigger").forEach((btn) => {
            btn.addEventListener("click", openPalette);
        });
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    }
})();
