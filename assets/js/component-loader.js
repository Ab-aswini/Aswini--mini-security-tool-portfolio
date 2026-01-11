/**
 * Component Loader
 * Loads shared HTML components (Navbar, Footer) into placeholder elements.
 * Handles active state for Navbar based on current URL.
 */

document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("nav-placeholder", "components/navbar.html");
    await loadComponent("footer-placeholder", "components/footer.html");
    
    // Initialize Lucide icons after content is loaded
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Set active nav item
    setActiveNav();
});

async function loadComponent(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const html = await response.text();
            element.innerHTML = html;
        } else {
            console.error(`Failed to load ${filePath}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

function setActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    const navItems = document.querySelectorAll(".tubelight-item");
    
    navItems.forEach(item => {
        const itemPage = item.getAttribute("data-page");
        if (itemPage === path) {
            item.classList.add("active");
            item.setAttribute("aria-current", "page");
        } else {
            item.classList.remove("active");
            item.removeAttribute("aria-current");
        }
    });
}
