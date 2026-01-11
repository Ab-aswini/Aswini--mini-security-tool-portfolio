class AnimatedBeam {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.path = options.pathEl;
        this.gradientPath = options.gradEl;

        this.fromId = options.from;
        this.toId = options.to;

        // React Props Map
        this.curvature = options.curvature || 0;
        this.reverse = options.reverse || false;
        this.endYOffset = options.endYOffset || 0; // New Prop from demo.tsx

        this.init();
    }

    init() {
        if (this.reverse && this.gradientPath) {
            this.gradientPath.classList.add('reverse');
        }

        this.updatePath();

        // Resize Observer
        this.observer = new ResizeObserver(() => this.updatePath());
        this.observer.observe(this.container);

        // Window Resize Fallback
        window.addEventListener('resize', () => this.updatePath());

        // Loop just in case of layout shifts
        setInterval(() => this.updatePath(), 2000);
    }

    updatePath() {
        const fromEl = document.getElementById(this.fromId);
        const toEl = document.getElementById(this.toId);

        if (!fromEl || !toEl || !this.container) return;

        const containerRect = this.container.getBoundingClientRect();
        const rectA = fromEl.getBoundingClientRect();
        const rectB = toEl.getBoundingClientRect();

        // Calculate Centers relative to container
        const startX = rectA.left - containerRect.left + rectA.width / 2;
        const startY = rectA.top - containerRect.top + rectA.height / 2;

        // End coordinates (with offsets if needed)
        const endX = rectB.left - containerRect.left + rectB.width / 2;
        const endY = (rectB.top - containerRect.top + rectB.height / 2) + this.endYOffset;

        // Bezier Control Point
        const controlY = startY - this.curvature;
        const midX = (startX + endX) / 2;

        const d = `M ${startX},${startY} Q ${midX},${controlY} ${endX},${endY}`;

        if (this.path) this.path.setAttribute('d', d);
        if (this.gradientPath) this.gradientPath.setAttribute('d', d);
    }
}
