/**
 * GooeyText Component (Vanilla JS Port)
 * Replicates the React "gooey-text-morphing" component.
 */

class GooeyText {
    constructor(containerId, texts, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`GooeyText: Container #${containerId} not found.`);
            return;
        }

        this.texts = texts;
        this.morphTime = options.morphTime || 1;
        this.cooldownTime = options.cooldownTime || 0.25;

        this.textIndex = this.texts.length - 1;
        this.time = new Date();
        this.morph = 0;
        this.cooldown = this.cooldownTime;

        this.init();
    }

    init() {
        this.injectSVGFilter();
        this.createElements();
        this.animate();
    }

    injectSVGFilter() {
        if (document.getElementById('gooey-filter-svg')) return;

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.id = "gooey-filter-svg";
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");

        const defs = document.createElementNS(svgNS, "defs");
        const filter = document.createElementNS(svgNS, "filter");
        filter.id = "threshold";

        const feColorMatrix = document.createElementNS(svgNS, "feColorMatrix");
        feColorMatrix.setAttribute("in", "SourceGraphic");
        feColorMatrix.setAttribute("type", "matrix");
        feColorMatrix.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140");

        filter.appendChild(feColorMatrix);
        defs.appendChild(filter);
        svg.appendChild(defs);

        document.body.appendChild(svg);
    }

    createElements() {
        // Clear container
        this.container.innerHTML = '';
        this.container.classList.add('gooey-container');

        // Apply Filter to container wrapper (or specific inner div)
        // The React code applies filter to the wrapper of the spans
        const wrapper = document.createElement('div');
        wrapper.style.filter = "url(#threshold)";
        wrapper.style.display = "grid";
        wrapper.style.placeItems = "center";
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";

        this.text1 = document.createElement('span');
        this.text1.className = 'gooey-text';
        this.text1.style.gridArea = "1 / 1";

        this.text2 = document.createElement('span');
        this.text2.className = 'gooey-text';
        this.text2.style.gridArea = "1 / 1";

        // Initial Text
        this.text1.textContent = this.texts[this.textIndex % this.texts.length];
        this.text2.textContent = this.texts[(this.textIndex + 1) % this.texts.length];

        wrapper.appendChild(this.text1);
        wrapper.appendChild(this.text2);
        this.container.appendChild(wrapper);
    }

    setMorph(fraction) {
        if (!this.text1 || !this.text2) return;

        this.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        this.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        fraction = 1 - fraction;
        this.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        this.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    }

    doCooldown() {
        this.morph = 0;
        if (this.text1 && this.text2) {
            this.text2.style.filter = "";
            this.text2.style.opacity = "100%";
            this.text1.style.filter = "";
            this.text1.style.opacity = "0%";
        }
    }

    doMorph() {
        this.morph -= this.cooldown;
        this.cooldown = 0;
        let fraction = this.morph / this.morphTime;

        if (fraction > 1) {
            this.cooldown = this.cooldownTime;
            fraction = 1;
        }

        this.setMorph(fraction);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        const newTime = new Date();
        const shouldIncrementIndex = this.cooldown > 0;
        const dt = (newTime.getTime() - this.time.getTime()) / 1000;
        this.time = newTime;

        this.cooldown -= dt;

        if (this.cooldown <= 0) {
            if (shouldIncrementIndex) {
                this.textIndex++;
                if (this.text1 && this.text2) {
                    this.text1.textContent = this.texts[this.textIndex % this.texts.length];
                    this.text2.textContent = this.texts[(this.textIndex + 1) % this.texts.length];
                }
            }
            this.doMorph();
        } else {
            this.doCooldown();
        }
    }
}
