
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cpu-container');
    if (!container) return;

    // The SVG markup ported from React
    // Note: React uses className, we use class.
    // We replaced motion.div logic with CSS animations in cpu.css

    // We also need to handle the <defs> for gradients and masks.

    const svgMarkup = `
    <svg class="cpu-architecture-svg" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <!-- MASKS: Increased stroke-width to 3 to fix "too dim" issue while keeping it sleek -->
            <mask id="cpu-mask-1"><path d="M 10 20 h 79.5 q 5 0 5 5 v 24" stroke-width="3" stroke="white" fill="none"/></mask>
            <mask id="cpu-mask-2"><path d="M 180 10 h -69.7 q -5 0 -5 5 v 24" stroke-width="3" stroke="white" fill="none"/></mask>
            <mask id="cpu-mask-3"><path d="M 130 20 v 21.8 q 0 5 -5 5 h -10" stroke-width="3" stroke="white" fill="none"/></mask>
            <mask id="cpu-mask-4"><path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50" stroke-width="3" stroke="white" fill="none"/></mask>
            <mask id="cpu-mask-5"><path d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20" stroke-width="3" stroke="white" fill="none"/></mask>
            <mask id="cpu-mask-6"><path d="M 94.8 95 v -36" stroke-width="3" stroke="white" fill="none"/></mask>
            <mask id="cpu-mask-7"><path d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14" stroke-width="3" stroke="white" fill="none"/></mask>
            <mask id="cpu-mask-8"><path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 20" stroke-width="3" stroke="white" fill="none"/></mask>

            <!-- GRADIENTS -->
            <radialGradient id="cpu-blue-grad" fx="1"><stop offset="0%" stop-color="#00E8ED"/><stop offset="50%" stop-color="#0088FF"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            <radialGradient id="cpu-yellow-grad" fx="1"><stop offset="0%" stop-color="#FFD800"/><stop offset="50%" stop-color="#FFD800"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            <radialGradient id="cpu-pinkish-grad" fx="1"><stop offset="0%" stop-color="#830CD1"/><stop offset="50%" stop-color="#FF008B"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            <radialGradient id="cpu-white-grad" fx="1"><stop offset="0%" stop-color="white"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            <radialGradient id="cpu-green-grad" fx="1"><stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            <radialGradient id="cpu-orange-grad" fx="1"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            <radialGradient id="cpu-cyan-grad" fx="1"><stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            <radialGradient id="cpu-rose-grad" fx="1"><stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="transparent"/></radialGradient>

            <filter id="cpu-light-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="1.5" dy="1.5" stdDeviation="1" flood-color="black" flood-opacity="0.1"/>
            </filter>

            <marker id="cpu-circle-marker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="18" markerHeight="18">
                <circle cx="5" cy="5" r="2" fill="black" stroke="#232323" stroke-width="0.5">
                    <animate attributeName="r" values="0; 3; 2" dur="0.5s" />
                </circle>
            </marker>

            <linearGradient id="cpu-connection-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4F4F4F"/>
                <stop offset="60%" stop-color="#121214"/>
            </linearGradient>

            <linearGradient id="cpu-text-gradient" x1="0" y1="0" x2="1" y2="0">
                 <stop offset="0%" stop-color="#666666">
                    <animate attributeName="offset" values="-2; -1; 0" dur="5s" repeatCount="indefinite"/>
                 </stop>
                 <stop offset="25%" stop-color="white">
                     <animate attributeName="offset" values="-1; 0; 1" dur="5s" repeatCount="indefinite"/>
                 </stop>
                 <stop offset="50%" stop-color="#666666">
                     <animate attributeName="offset" values="0; 1; 2" dur="5s" repeatCount="indefinite"/>
                 </stop>
            </linearGradient>
        </defs>

        <!-- Base Paths (Dashed Lines) -->
        <g stroke="currentColor" fill="none" stroke-width="0.3" stroke-dasharray="3 3">
            <path d="M 10 20 h 79.5 q 5 0 5 5 v 30" />
            <path d="M 180 10 h -69.7 q -5 0 -5 5 v 30" />
            <path d="M 130 20 v 21.8 q 0 5 -5 5 h -10" />
            <path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50" />
            <path d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20" />
            <path d="M 94.8 95 v -36" />
            <path d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14" />
            <path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 20" />
        </g>

        <!-- Animated Particles (The "Lights") -->
        <g mask="url(#cpu-mask-1)"><circle class="cpu-particle cpu-line-1" cx="0" cy="0" r="3" fill="url(#cpu-blue-grad)"/></g>
        <g mask="url(#cpu-mask-2)"><circle class="cpu-particle cpu-line-2" cx="0" cy="0" r="3" fill="url(#cpu-yellow-grad)"/></g>
        <g mask="url(#cpu-mask-3)"><circle class="cpu-particle cpu-line-3" cx="0" cy="0" r="3" fill="url(#cpu-pinkish-grad)"/></g>
        <g mask="url(#cpu-mask-4)"><circle class="cpu-particle cpu-line-4" cx="0" cy="0" r="3" fill="url(#cpu-white-grad)"/></g>
        <g mask="url(#cpu-mask-5)"><circle class="cpu-particle cpu-line-5" cx="0" cy="0" r="3" fill="url(#cpu-green-grad)"/></g>
        <g mask="url(#cpu-mask-6)"><circle class="cpu-particle cpu-line-6" cx="0" cy="0" r="3" fill="url(#cpu-orange-grad)"/></g>
        <g mask="url(#cpu-mask-7)"><circle class="cpu-particle cpu-line-7" cx="0" cy="0" r="3" fill="url(#cpu-cyan-grad)"/></g>
        <g mask="url(#cpu-mask-8)"><circle class="cpu-particle cpu-line-8" cx="0" cy="0" r="3" fill="url(#cpu-rose-grad)"/></g>

        <!-- CPU Center Box -->
        <g>
            <g fill="url(#cpu-connection-gradient)">
                <rect x="93" y="37" width="2.5" height="5" rx="0.7"/>
                <rect x="104" y="37" width="2.5" height="5" rx="0.7"/>
                <rect x="116.3" y="44" width="2.5" height="5" rx="0.7" transform="rotate(90 116.25 45.5)"/>
                <rect x="122.8" y="44" width="2.5" height="5" rx="0.7" transform="rotate(90 116.25 45.5)"/>
                <rect x="104" y="16" width="2.5" height="5" rx="0.7" transform="rotate(180 105.25 39.5)"/>
                <rect x="114.5" y="16" width="2.5" height="5" rx="0.7" transform="rotate(180 105.25 39.5)"/>
                <rect x="80" y="-13.6" width="2.5" height="5" rx="0.7" transform="rotate(270 115.25 19.5)"/>
                <rect x="87" y="-13.6" width="2.5" height="5" rx="0.7" transform="rotate(270 115.25 19.5)"/>
            </g>
            
            <rect x="85" y="40" width="30" height="20" rx="2" fill="#181818" filter="url(#cpu-light-shadow)"/>
            <text x="100" y="53" font-size="6" fill="url(#cpu-text-gradient)" font-weight="600" letter-spacing="0.05em" text-anchor="middle">CPU</text>
        </g>

    </svg>
    `;

    container.innerHTML = svgMarkup;
});
