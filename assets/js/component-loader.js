/**
 * Component Loader
 * Loads shared HTML components (Navbar, Footer) into placeholder elements.
 * Handles active state for Navbar based on current URL and depth prefixing.
 */

document.addEventListener("DOMContentLoaded", async () => {
    const prefix = getPathPrefix();
    await loadComponent("nav-placeholder", prefix + "components/navbar.html", prefix);
    await loadComponent("footer-placeholder", prefix + "components/footer.html", prefix);
    
    // Initialize Lucide icons after content is loaded
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Set active nav item
    setActiveNav();
});

function getPathPrefix() {
    // Check component-loader script src to determine relative depth
    const scripts = document.querySelectorAll('script[src*="component-loader.js"]');
    if (scripts.length > 0) {
        const src = scripts[0].getAttribute('src') || '';
        const count = (src.match(/\.\.\//g) || []).length;
        return '../'.repeat(count);
    }
    return '';
}

async function loadComponent(elementId, filePath, prefix) {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const response = await fetch(filePath);
        if (response.ok) {
            let html = await response.text();
            
            // Adjust relative hrefs in loaded component HTML
            if (prefix) {
                html = html.replace(/href="([^"#/:][^"]*)"/g, (match, p1) => {
                    // Ignore javascript:, mailto:, tel:, http, https, #
                    if (p1.startsWith('javascript:') || p1.startsWith('mailto:') || p1.startsWith('tel:') || p1.startsWith('#')) {
                        return match;
                    }
                    // Strip leading slash if any
                    const cleanPath = p1.startsWith('/') ? p1.slice(1) : p1;
                    return `href="${prefix}${cleanPath}"`;
                });
            } else {
                // Remove leading slashes for local file compatibility if root
                html = html.replace(/href="\/([^"]*)"/g, 'href="$1"');
            }
            
            element.innerHTML = html;
        } else {
            console.error(`Failed to load ${filePath}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

function setActiveNav() {
    const fullPath = window.location.pathname.toLowerCase();
    const navItems = document.querySelectorAll(".tubelight-item");
    
    let activePage = "index.html";
    if (fullPath.includes("/tools/") || fullPath.endsWith("tools.html")) {
        activePage = "tools.html";
    } else if (fullPath.includes("/projects/") || fullPath.endsWith("projects.html")) {
        activePage = "projects.html";
    } else if (fullPath.includes("/universe/") || fullPath.endsWith("universe.html")) {
        activePage = "universe.html";
    } else if (fullPath.endsWith("about.html")) {
        activePage = "about.html";
    } else if (fullPath.endsWith("contact.html")) {
        activePage = "contact.html";
    } else if (fullPath.endsWith("failures.html") || fullPath.endsWith("changelog.html") || fullPath.endsWith("version-history.html")) {
        activePage = "";
    }
    
    navItems.forEach(item => {
        const itemPage = item.getAttribute("data-page");
        if (itemPage && itemPage === activePage) {
            item.classList.add("active");
            item.setAttribute("aria-current", "page");
        } else {
            item.classList.remove("active");
            item.removeAttribute("aria-current");
        }
    });
}

