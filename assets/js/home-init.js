document.addEventListener('DOMContentLoaded', () => {
    // --- Gooey Text Initialization ---
    if (typeof GooeyText !== 'undefined') {
        new GooeyText('gooey-hero-container', [
            // --- Professional Identity Lines (Founder-Grade) ---
            "Marketing Analyst",
            "Product Strategist",
            "Systems Thinker",
            "Digital Intelligence_Builder",
            "Cyber-Curious Learner",

            // --- Hybrid / Tech-Business Identity ---
            "Hybrid Problem Solver",
            "Business-Driven Creator",
            "Automation Explorer",
            "Tech-Enabled Innovator",

            // --- Coding + Creative Vocabulary ---
            "Vibe Coder",
            "UI Experimenter",
            "Micro-Tool Architect",
            "Data-Informed Builder",

            // --- Personal Identity Themes ---
            "Fast Learner",
            "Execution Focused",
            "Always Improving"
        ], {
            morphTime: 1.5,
            cooldownTime: 3.0
        });
    }

    // --- Animated Beam Initialization ---
    if (typeof AnimatedBeam !== 'undefined') {
        const beams = [
            // Top Row
            { from: 'icon-drive', to: 'icon-brain', curve: -50, endYOffset: -10 },
            { from: 'icon-docs', to: 'icon-brain', curve: -50, endYOffset: -10 },
            // Middle Row
            { from: 'icon-telegram', to: 'icon-brain', curve: 20 },
            { from: 'icon-instagram', to: 'icon-brain', curve: -20 },
            // Bottom Row
            { from: 'icon-whatsapp', to: 'icon-brain', curve: 50, endYOffset: 10 },
            { from: 'icon-messenger', to: 'icon-brain', curve: 50, endYOffset: 10 }
        ];

        const svgContainer = document.querySelector('.beam-svg-container svg');
        if (svgContainer) {
            beams.forEach(b => {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.classList.add('beam-path');

                const gradPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                gradPath.classList.add('beam-gradient');
                gradPath.setAttribute('stroke', 'url(#beam-grad)');

                svgContainer.appendChild(path);
                svgContainer.appendChild(gradPath);

                new AnimatedBeam('beam-container', {
                    from: b.from,
                    to: b.to,
                    curvature: b.curve,
                    endYOffset: b.endYOffset,
                    reverse: b.reverse,
                    pathEl: path,
                    gradEl: gradPath
                });
            });
        }
    }
});
