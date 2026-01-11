# Aswini--mini-security-tool-portfolio
# Zero Budget Resources for Digital Intelligence Tools
 This project is designed to be lightweight and run entirely client-side, making it perfect for free hosting tiers. Here are the recommended resources to run, maintain, and expand this project **without any cost**.

 ## 1. Free Hosting
 Since this is a static website (HTML/CSS/JS), you can host it for free on several platforms.

 ### Recommended: **Firebase Hosting**
 *   **Why**: You are already familiar with Firebase. It offers a generous free tier (Spark Plan) with SSL, custom domains, and global CDN.
 *   **Setup**:
     1.  Install CLI: `npm install -g firebase-tools`
     2.  Login: `firebase login`
     3.  Init: `firebase init hosting` (Select your project folder)
     4.  Deploy: `firebase deploy`

 ### Alternatives:
 *   **GitHub Pages**: Completely free. Just push your code to a GitHub repository and enable Pages in settings.
 *   **Vercel / Netlify**: Excellent for static sites, instant deployments from Git.

 ## 2. Free APIs & Data Sources used
 The tools in this project currently use client-side logic or free public APIs.

 *   **IP Intelligence**:
     *   **Current**: [ipapi.co](https://ipapi.co/) (Free tier: 1,000 requests/day, no key required).
     *   **Alternative**: [ipinfo.io](https://ipinfo.io/) (Free tier available).
 *   **Image EXIF**:
     *   **Library**: [exif-js](https://github.com/exif-js/exif-js) (Open Source, client-side only).
 *   **Username Checker**:
     *   **Method**: Uses "Direct Discovery" links to avoid CORS proxy costs. No backend required.
 *   **Icons**:
     *   **Library**: [Lucide](https://lucide.dev/) (Open Source, free CDN).

 ## 3. Free Development Tools
 *   **Code Editor**: VS Code.
 *   **Version Control**: GitHub (Free private repositories).
 *   **Design Assets**:
     *   **Images**: [Unsplash](https://unsplash.com/) (Free stock photos).
     *   **Fonts**: [Google Fonts](https://fonts.google.com/) (Free).

 ## 4. Future "No Budget" Expansions
 If you need backend functionality (like saving reports) later:
 *   **Database**: Firebase Firestore (Spark Plan has free read/write quotas).
 *   **Auth**: Firebase Authentication (Free for email/password and social login).

 ## Summary of Cost: $0.00
 *   **Hosting**: $0 (Firebase/GitHub Pages)
 *   **Domain**: $0 (Use `web.app` or `github.io` subdomain)
 *   **APIs**: $0 (Free tiers)
