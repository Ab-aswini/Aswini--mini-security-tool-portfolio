
const Sphere = {
    container: document.getElementById('sphere-container'),
    // FULL UNIVERSE LIST (Restored & Audited)
    slugs: [
        // Core Web & Languages
        "typescript", "javascript", "dart", "java", "python", "html5", "css3",
        "nodedotjs", "express", "react", "nextdotjs", "vue", "angular", "tailwindcss",

        // Mobile & Desktop
        "flutter", "android", "swift", "kotlin", "electron",

        // Cloud & Backend
        "firebase", "googlecloud", "vercel", "netlify", "docker", "kubernetes",
        "postgresql", "mongodb", "redis", "nginx", "prisma", "graphql",

        // Google Ecosystem
        "google", "gmail", "googledocs", "googlesheets", "googleslides",
        "googleforms", "googlephotos", "googlecalendar", "googledrive", "chrome",

        // Hacker Ops & Infrastructure
        "torbrowser", "virtualbox", "protonvpn", "digitalocean", "vultr",
        "metasploit", "owasp", "kalilinux", "wireshark", "burpsuite",

        // Cyber & Security
        "linux", "ubuntu", "signal",

        // Design & Product
        "figma", "miro", "notion",
        "trello", "jira", "asana", "slack", "discord", "zoom",

        // Dev Tools
        "git", "github", "gitlab", "postman", "insomnia", "sentry"
    ],
    items: [],
    radius: 220,
    mouseX: 0,
    mouseY: 0,

    // Animation State
    targetRotationX: 0.002,
    targetRotationY: 0.002,
    currentRotationX: 0.002,
    currentRotationY: 0.002,

    // Helper to fix names and fetch URLs (The Audit Fix)
    getIconConfig(slug) {
        // Default: capitalize first letter, use slug as is
        let title = slug.charAt(0).toUpperCase() + slug.slice(1);
        let iconSlug = slug;

        // Special Mappings
        const map = {
            'nodedotjs': { title: 'Node.js', icon: 'nodedotjs' },
            'nextdotjs': { title: 'Next.js', icon: 'nextdotjs' },
            'visualstudiocode': { title: 'VS Code', icon: 'visualstudiocode' },
            'kalilinux': { title: 'Kali Linux', icon: 'kalilinux' },
            'googledocs': { title: 'Docs', icon: 'googledocs' },
            'googlesheets': { title: 'Sheets', icon: 'googlesheets' },
            'googleforms': { title: 'Forms', icon: 'googleforms' },
            'googlephotos': { title: 'Photos', icon: 'googlephotos' },
            'googleslides': { title: 'Slides', icon: 'googleslides' },
            'googlecalendar': { title: 'Calendar', icon: 'googlecalendar' },
            'googledrive': { title: 'Drive', icon: 'googledrive' },
            'microsoftoffice': { title: 'Office', icon: 'microsoftoffice' },
            'microsoftword': { title: 'Word', icon: 'microsoftword' },
            'microsoftexcel': { title: 'Excel', icon: 'microsoftexcel' },
            'microsoftpowerpoint': { title: 'PowerPoint', icon: 'microsoftpowerpoint' },
            'microsoftteams': { title: 'Teams', icon: 'microsoftteams' },
            'microsoftoutlook': { title: 'Outlook', icon: 'microsoftoutlook' },
            'css3': { title: 'CSS3', icon: 'css' },
            'html5': { title: 'HTML5', icon: 'html5' },
            'azuredevops': { title: 'Azure', icon: 'azuredevops' },
            'torbrowser': { title: 'Tor', icon: 'torbrowser' },
            'virtualbox': { title: 'VirtualBox', icon: 'virtualbox' },
            'protonvpn': { title: 'ProtonVPN', icon: 'protonvpn' },
            'digitalocean': { title: 'DigitalOcean', icon: 'digitalocean' },
            'linode': { title: 'Linode', icon: 'linode' },
            'vultr': { title: 'Vultr', icon: 'vultr' },
            'metasploit': { title: 'Metasploit', icon: 'metasploit' },
            'owasp': { title: 'OWASP', icon: 'owasp' },
            'burpsuite': { title: 'Burp Suite', icon: 'burpsuite' },
            'wireshark': { title: 'Wireshark', icon: 'wireshark' },
            'chrome': { title: 'Chrome', icon: 'googlechrome' }
        };

        if (map[slug]) {
            return { title: map[slug].title, iconSlug: map[slug].icon };
        }

        // Generic fix for 'dot' names if missed above
        if (iconSlug.includes('dot')) {
            iconSlug = iconSlug.replace('dot', '.');
        }

        return { title, iconSlug };
    },

    init() {
        if (!this.container) return;

        // Responsive radius
        if (window.innerWidth < 600) {
            this.radius = 180; // Restored larger size for mobile
        } else if (window.innerWidth < 1024) {
            this.radius = 220; // Restored larger size for tablet
        }

        // Fetch and create items
        this.slugs.forEach((slug, i) => {
            this.createItem(slug, i);
        });

        document.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            // Normalize mouse position relative to center of container
            // Sensitivity drastically reduced (0.0001 range) for "slow moving" feel
            const x = (e.clientX - rect.left - rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2);

            // Set targets based on mouse position
            // Dividing by 5000 makes it very slow and smooth
            this.targetRotationY = x * 0.0001;
            this.targetRotationX = y * 0.0001;
        });

        // Loop
        this.animate();
    },

    async createItem(slug, index) {
        const el = document.createElement('div');
        el.className = 'sphere-item';

        // Clean title for Tooltip/Alt text (Not displayed directly)
        let title = slug;
        if (title.includes('dot')) title = title.replace('dot', '.');
        title = title.charAt(0).toUpperCase() + title.slice(1);

        // Icon Container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'sphere-icon';

        // Add tooltip title
        iconContainer.title = title;

        try {
            // Config from helper
            const config = this.getIconConfig(slug);
            title = config.title;
            const iconSlug = config.iconSlug;

            const response = await fetch(`https://cdn.simpleicons.org/${iconSlug}`);
            if (response.ok) {
                const svgText = await response.text();
                iconContainer.innerHTML = svgText;
                const svg = iconContainer.querySelector('svg');
                if (svg) {
                    svg.setAttribute('width', '40');
                    svg.setAttribute('height', '40');
                }
            } else {
                // Fallback: Just first letter if icon fails
                iconContainer.innerText = title.substring(0, 2);
                iconContainer.style.fontWeight = 'bold';
                iconContainer.style.fontSize = '1.2rem';
            }
        } catch (e) {
            console.error(`Error loading ${slug}`, e);
            iconContainer.innerText = title.substring(0, 1);
        }

        // Title Label (Restored)
        const titleEl = document.createElement('span');
        titleEl.className = 'sphere-title';
        titleEl.innerText = title;

        el.appendChild(iconContainer);
        el.appendChild(titleEl);

        // Fibonacci Sphere Distribution (Perfectly Even)
        const phi = Math.acos(-1 + (2 * index) / this.slugs.length);
        const theta = Math.sqrt(this.slugs.length * Math.PI) * phi;

        this.items.push({
            el,
            x: this.radius * Math.cos(theta) * Math.sin(phi),
            y: this.radius * Math.sin(theta) * Math.sin(phi),
            z: this.radius * Math.cos(phi)
        });

        this.container.appendChild(el);
    },

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth Inertia (Damping)
        // Move current rotation 5% towards target rotation every frame
        this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.05;
        this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.05;

        // Ensure there's always a tiny bit of movement even if mouse is center
        if (Math.abs(this.currentRotationX) < 0.001) this.currentRotationX = 0.001;
        if (Math.abs(this.currentRotationY) < 0.001) this.currentRotationY = 0.001;

        const rotationX = this.currentRotationX;
        const rotationY = this.currentRotationY;

        this.items.forEach(item => {
            // Rotate around X
            const y = item.y * Math.cos(rotationX) - item.z * Math.sin(rotationX);
            const z = item.y * Math.sin(rotationX) + item.z * Math.cos(rotationX);
            item.y = y;
            item.z = z;

            // Rotate around Y
            const x = item.x * Math.cos(rotationY) - item.z * Math.sin(rotationY);
            const z2 = item.x * Math.sin(rotationY) + item.z * Math.cos(rotationY);
            item.x = x;
            item.z = z2;

            // Perspective
            const scale = (this.radius * 2.5 + item.z) / (this.radius * 2.5);
            const visibleScale = Math.max(0.1, Math.min(1.5, scale));
            const opacity = Math.max(0.1, Math.min(1, scale));

            // Alignment Fix using translate(-50%, -50%)
            // This centers the item on its coordinate point
            const screenX = item.x + this.container.offsetWidth / 2;
            const screenY = item.y + this.container.offsetHeight / 2;

            item.el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) scale(${visibleScale}) translate(-50%, -50%)`;
            item.el.style.opacity = opacity;
            item.el.style.zIndex = Math.floor(visibleScale * 100);

            // Depth visual effects w/ Light Mode Check
            // In light mode, we want LESS glow to avoid "ugly" blobs
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';

            if (visibleScale > 1.1) {
                if (isLight) {
                    // VERY subtle dark shadow for clean look, NO color
                    item.el.style.filter = 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))';
                } else {
                    item.el.style.filter = 'brightness(1.2) drop-shadow(0 0 8px var(--accent))'; // Neon glow
                }
            } else {
                item.el.style.filter = 'none';
            }
        });

        // Active Item Logic (Find closest to front)
        if (this.items.length === 0) return; // Prevent crash if items not loaded yet

        // Closest item has highest 'z' value
        const activeItem = this.items.reduce((prev, current) => (prev.z > current.z) ? prev : current);

        // Update Info Panel if changed
        if (activeItem && activeItem !== this.lastActiveItem) {
            this.updateInfoPanel(activeItem);
            this.lastActiveItem = activeItem;
        }
    },

    // Fix for missing function error
    updateInfoPanel(item) {
        // Placeholder for future info panel features.
        // Currently prevents the "is not a function" error.
    }
};

document.addEventListener('DOMContentLoaded', () => Sphere.init());
