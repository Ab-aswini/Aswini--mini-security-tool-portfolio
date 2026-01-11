/**
 * Global Application Logic
 * Includes: Theme Management, Navbar Interaction, Footer Animation
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Initialize Lucide Icons
    // -------------------------------------------------------------------------
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // -------------------------------------------------------------------------
    // 2. Theme Management
    // -------------------------------------------------------------------------
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme") || "light";
    updateThemeButtons(currentTheme);

    // Ensure global access for toggle button onclick attribute
    window.toggleTheme = function () {
        const current = root.getAttribute("data-theme");
        const next = current === "light" ? "dark" : "light";

        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        updateThemeButtons(next);
    };

    function updateThemeButtons(theme) {
        const buttons = document.querySelectorAll(".theme-toggle-btn");
        buttons.forEach(btn => {
            btn.textContent = theme === "dark" ? "☀️" : "🌙";
        });
    }

});



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

