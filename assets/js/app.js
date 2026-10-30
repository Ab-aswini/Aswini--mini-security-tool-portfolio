/**
 * Global Application Logic
 * Includes: Theme Management, Navbar Interaction, Footer Animation
 */

// -------------------------------------------------------------------------
// 2. Global Theme Management
// -------------------------------------------------------------------------
window.updateThemeButtons = function (theme) {
    const activeTheme = theme || document.documentElement.getAttribute("data-theme") || "light";
    const buttons = document.querySelectorAll(".theme-toggle-btn");
    buttons.forEach(btn => {
        btn.textContent = activeTheme === "dark" ? "☀️" : "🌙";
    });
};

window.toggleTheme = function () {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    window.updateThemeButtons(next);
};

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Initialize Lucide Icons
    // -------------------------------------------------------------------------
    if (window.lucide) {
        window.lucide.createIcons();
    }

    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    window.updateThemeButtons(currentTheme);
});

// -------------------------------------------------------------------------
// 3. Global Toast Notifications & Clipboard Helpers
// -------------------------------------------------------------------------
window.showToast = function (message, type = 'info') {
    let container = document.getElementById('v2-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'v2-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `v2-toast v2-toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';
    if (type === 'warn') iconName = 'alert-circle';

    toast.innerHTML = `
        <i data-lucide="${iconName}" class="v2-toast-icon"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    if (window.lucide) {
        window.lucide.createIcons();
    }

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

window.copyToClipboard = async function (text, successMsg = 'Copied to clipboard!') {
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
        window.showToast(successMsg, 'success');
    } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        window.showToast(successMsg, 'success');
    }
};



// -------------------------------------------------------------------------
// 5. Scroll Interaction (Header & Sections)
// -------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');

    // Navbar Scroll visibility
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 150) {
                header.classList.add('visible');
                header.classList.add('scrolled');
            } else {
                header.classList.remove('visible');
                header.classList.remove('scrolled');
            }
        });
    }

    // Section Fade-in Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

