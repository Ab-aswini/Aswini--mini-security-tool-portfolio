/**
 * Cloudflare Worker CORS Proxy
 * ============================
 * Deploy this as a Cloudflare Worker (free tier: 100K requests/day)
 * to replace all dead public CORS proxies in your security tools.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://dash.cloudflare.com → Workers & Pages → Create
 * 2. Name it something like "cyber-proxy"
 * 3. Paste this entire script into the editor
 * 4. Deploy
 * 5. Your proxy URL will be: https://cyber-proxy.<your-subdomain>.workers.dev
 * 6. Find & replace all proxy URLs in your tools with your new proxy URL
 *
 * USAGE:
 *   https://cyber-proxy.your-subdomain.workers.dev/?url=https://example.com
 *
 * SECURITY:
 * - Restricted to your portfolio domain only (update ALLOWED_ORIGINS below)
 * - Rate limited per IP (60 requests/minute)
 * - Blocks requests to internal/private IPs
 */

const ALLOWED_ORIGINS = [
  'https://rouse.co.in',
  'http://localhost',
  'http://127.0.0.1',
  'null' // for local file:// testing
];

// Rate limiting map (in-memory, resets on worker restart)
const rateLimitMap = new Map();
const RATE_LIMIT = 60; // requests per minute per IP
const RATE_WINDOW = 60000; // 1 minute in ms

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_WINDOW) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT) return true;
  return false;
}

function isPrivateIP(hostname) {
  const privatePatterns = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^0\./,
    /^169\.254\./,
    /^::1$/,
    /^fc/i,
    /^fd/i,
    /^fe80/i,
  ];
  return privatePatterns.some(p => p.test(hostname));
}

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

    // Rate limit check
    if (isRateLimited(clientIP)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again in a minute.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Extract target URL
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response(JSON.stringify({
        service: 'CyberProxy',
        usage: '?url=https://example.com',
        status: 'online'
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Validate target URL
    let parsedTarget;
    try {
      parsedTarget = new URL(targetUrl);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Block private IPs
    if (isPrivateIP(parsedTarget.hostname)) {
      return new Response(JSON.stringify({ error: 'Access to private/internal addresses is blocked' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Only allow http/https
    if (!['http:', 'https:'].includes(parsedTarget.protocol)) {
      return new Response(JSON.stringify({ error: 'Only HTTP/HTTPS URLs are supported' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    try {
      // Fetch the target
      const targetResponse = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CyberProxy/1.0)',
          'Accept': request.headers.get('Accept') || '*/*',
        },
        redirect: 'follow',
      });

      // Build response with CORS headers
      const responseHeaders = new Headers(targetResponse.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Expose-Headers', '*');
      responseHeaders.set('X-Proxy-Source', 'CyberProxy');
      responseHeaders.set('X-Target-Status', targetResponse.status.toString());

      // Pass through the target's original headers for tools that need them
      const targetHeaders = {};
      targetResponse.headers.forEach((value, key) => {
        targetHeaders[key] = value;
      });
      responseHeaders.set('X-Target-Headers', JSON.stringify(targetHeaders));

      return new Response(targetResponse.body, {
        status: targetResponse.status,
        headers: responseHeaders,
      });

    } catch (fetchError) {
      return new Response(JSON.stringify({ error: `Proxy fetch failed: ${fetchError.message}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
};

