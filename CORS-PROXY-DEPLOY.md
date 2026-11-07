# CORS Proxy Deployment Guide

## Quick Deploy (2 minutes)

### Option A: Cloudflare Dashboard (No CLI needed)
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Sign up (free)
2. Click **Workers & Pages** → **Create** → **Create Worker**
3. Name it: `security-tools-proxy`
4. Click **Deploy** (with the default "Hello World")
5. Click **Edit Code** → Delete everything → Paste contents of `cors-proxy-worker.js`
6. Click **Deploy**
7. Your proxy URL: `https://security-tools-proxy.<your-subdomain>.workers.dev`

### Option B: Wrangler CLI
```bash
npm install -g wrangler
wrangler login          # Opens browser for Cloudflare login
wrangler deploy         # Deploys using wrangler.toml config
```

## After Deploying

Run this find-and-replace across all tool files:
```
Find:    https://api.allorigins.win/get?url=
Replace: https://security-tools-proxy.<your-subdomain>.workers.dev/?url=
```

Files that use the proxy:
- `tools/site-dossier.html`
- `tools/subresource-scanner.html`
- `archive/tls-auditor.html`
- `archive/favicon-analyzer.html`
- `archive/js-vuln-scanner.html`
- `archive/asset-visualizer.html`

## Free Tier Limits
- 100,000 requests/day
- 10ms CPU time per request
- More than enough for a portfolio site

