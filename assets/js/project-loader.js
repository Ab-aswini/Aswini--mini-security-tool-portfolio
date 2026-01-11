document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/data/projects.json')
        .then(response => response.json())
        .then(data => {
            renderProjects(data);
            if (window.lucide) {
                window.lucide.createIcons();
            }
        })
        .catch(error => console.error('Error loading projects:', error));
});

function renderProjects(projects) {
    const categories = {
        'tech': 'tech-grid',
        'business': 'business-grid',
        'product': 'product-grid',
        'lifestyle': 'lifestyle-grid',
        'failures': 'failures-grid'
    };

    // Clear existing content (if any placeholders)
    Object.values(categories).forEach(id => {
        const container = document.getElementById(id);
        if (container) container.innerHTML = '';
    });

    projects.forEach(project => {
        const containerId = categories[project.category];
        const container = document.getElementById(containerId);

        if (container) {
            const card = createProjectCard(project);
            container.appendChild(card);
        }
    });

    // Re-run lucide icons for new elements
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function createProjectCard(project) {
    const article = document.createElement('article');
    article.className = 'project-card';
    if (project.highlight) {
        article.style.borderColor = 'var(--accent)';
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'card-content';

    const titleH3 = document.createElement('h3');
    titleH3.className = 'project-title';
    titleH3.textContent = project.title;

    const overviewP = document.createElement('p');
    overviewP.className = 'project-overview';
    overviewP.textContent = project.overview;

    const descP = document.createElement('p');
    descP.className = 'project-description';
    descP.innerHTML = project.description; // Allow HTML for strong tags

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'project-tags';

    project.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;

        // Special styling for failures
        if (project.category === 'failures' && (tag === project.failure_tag)) {
            span.style.background = 'rgba(239,68,68,0.1)';
            span.style.color = '#ef4444';
        }

        tagsDiv.appendChild(span);
    });

    contentDiv.appendChild(titleH3);
    contentDiv.appendChild(overviewP);
    contentDiv.appendChild(descP);
    contentDiv.appendChild(tagsDiv);

    const ctaLink = document.createElement('a');
    if (project.cta) {
        ctaLink.href = project.cta.link;
        ctaLink.className = 'project-cta';
        if (project.highlight) {
            ctaLink.style.background = 'var(--accent)';
            ctaLink.style.color = '#fff';
        }
        ctaLink.innerHTML = `${project.cta.text} <i data-lucide="${project.cta.icon}"></i>`;
    }

    article.appendChild(contentDiv);
    if (project.cta) {
        article.appendChild(ctaLink);
    }

    return article;
}
