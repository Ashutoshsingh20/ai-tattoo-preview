# Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended - Free Tier)

```bash
npm i -g vercel
vercel --prod
```

Or connect your GitHub repo at [vercel.com](https://vercel.com/new) - auto-deploys on push.

### 2. Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

Or drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop).

### 3. GitHub Pages

Add to `vite.config.ts`:
```ts
export default defineConfig({
  base: '/ai-tattoo-preview/',
  // ... rest
})
```

Then:
```bash
npm run build
npx gh-pages -d dist
```

Enable GitHub Pages in repo settings → Pages → Source: gh-pages branch.

### 4. Cloudflare Pages

1. Go to [dash.cloudflare.com/pages](https://dash.cloudflare.com/pages)
2. Connect GitHub repo
3. Build command: `npm run build`
4. Output directory: `dist`

## Environment Requirements

- **HTTPS Required**: Camera API needs secure context
- **Node.js**: v18+ recommended
- **Browser Support**: Modern browsers with getUserMedia support
  - Chrome 53+
  - Firefox 36+
  - Safari 11+
  - Edge 79+

## Post-Deployment Checklist

- [ ] Test camera permissions on mobile & desktop
- [ ] Verify HTTPS certificate
- [ ] Test image download functionality
- [ ] Check mobile responsiveness
- [ ] Set up analytics (Plausible, Fathom, or PostHog)
- [ ] Configure SEO metadata
- [ ] Add error tracking (Sentry)
- [ ] Set up feedback form

## Custom Domain

After deploying, add your domain:
- **Vercel**: Settings → Domains → Add
- **Netlify**: Site settings → Domain management
- **Cloudflare**: Automatic if using CF domain

## Performance Tips

1. **Image Optimization**: Replace emoji with WebP tattoo designs
2. **Code Splitting**: Lazy load camera module
3. **CDN**: Vercel/Netlify/CF provide this by default
4. **Caching**: Set cache headers in `vercel.json` or `netlify.toml`

## Monitoring

Free options:
- **Uptime**: UptimeRobot, StatusCake
- **Analytics**: Plausible, Fathom, Umami
- **Errors**: Sentry free tier
- **Logs**: Vercel/Netlify dashboards

---

**Live in 5 minutes** with any of these platforms! 🚀
