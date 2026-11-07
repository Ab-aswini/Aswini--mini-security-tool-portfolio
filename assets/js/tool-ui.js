/**
 * UI Helpers for Security Tools
 * Provides skeleton loading states and API error fallback UI.
 * Include after tools.css which has the matching CSS classes.
 */

const ToolUI = {
    /**
     * Show skeleton loading placeholders in a container.
     * @param {string|HTMLElement} container - Selector or element
     * @param {number} rows - Number of skeleton rows (default 3)
     */
    showSkeleton(container, rows = 3) {
        const el = typeof container === 'string' ? document.querySelector(container) : container;
        if (!el) return;
        let html = '';
        for (let i = 0; i < rows; i++) {
            html += `<div class="skeleton skeleton-block"></div>`;
        }
        el.innerHTML = html;
    },

    /**
     * Show a skeleton that mimics text content loading.
     * @param {string|HTMLElement} container - Selector or element
     * @param {number} lines - Number of text lines (default 4)
     */
    showTextSkeleton(container, lines = 4) {
        const el = typeof container === 'string' ? document.querySelector(container) : container;
        if (!el) return;
        const widths = ['long', 'medium', 'long', 'short', 'medium', 'long'];
        let html = '';
        for (let i = 0; i < lines; i++) {
            html += `<div class="skeleton skeleton-text ${widths[i % widths.length]}"></div>`;
        }
        el.innerHTML = html;
    },

    /**
     * Show API error fallback UI with retry button.
     * @param {string|HTMLElement} container - Selector or element
     * @param {object} options - { title, message, onRetry, icon }
     */
    showFallback(container, options = {}) {
        const el = typeof container === 'string' ? document.querySelector(container) : container;
        if (!el) return;

        const {
            title = 'Service Unavailable',
            message = 'The external API could not be reached. This may be due to rate limiting or the service being temporarily down.',
            onRetry = null,
            icon = '⚠️'
        } = options;

        el.innerHTML = `
            <div class="api-fallback">
                <div class="fallback-icon">${icon}</div>
                <div class="fallback-title">${title}</div>
                <div class="fallback-msg">${message}</div>
                ${onRetry ? '<button class="fallback-retry" id="__fallback_retry">Try Again</button>' : ''}
            </div>
        `;

        if (onRetry) {
            const btn = el.querySelector('#__fallback_retry');
            if (btn) btn.addEventListener('click', onRetry);
        }
    }
};

// Export for module environments, otherwise attach to window
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToolUI;
}

