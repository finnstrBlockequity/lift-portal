# Lift Foils - Dealer Portal

Multi-board configurator with dealer application. Generates Shopify + NetSuite compatible order data.

## Deploy to Vercel (fastest - 2 minutes)

1. Push this folder to a GitHub repo (or just drag the folder into Vercel)
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" → Import your repo
4. Framework preset: **Vite** (should auto-detect)
5. Click **Deploy**
6. Your site is live at `your-project.vercel.app`

**Custom domain:** In Vercel dashboard → Settings → Domains → Add `dealers.liftfoils.com` (or whatever subdomain). Then add a CNAME record in your DNS pointing to `cname.vercel-dns.com`.

## Deploy to Railway (alternative)

1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. New Project → Deploy from GitHub repo
4. Add a `Dockerfile` or use the Nixpacks builder (auto-detects Vite)
5. Railway will build and deploy automatically

## Deploy to Netlify (alternative)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. New Site → Import from Git
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy

## Local Development

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Updating Product Data

All product data lives at the top of `src/App.jsx` in the `PRODUCTS`, `WINGS`, `CONTROLLERS`, and `ACCESSORIES` objects. Update those and redeploy.

## Connecting to Shopify / NetSuite (Production)

When ready to send orders directly to your systems instead of displaying JSON:

1. Add a serverless function (Vercel API route or Railway backend) that receives the order JSON
2. POST to Shopify Admin API to create a draft order
3. POST to NetSuite RESTlet to create a sales order
4. Send confirmation email to cliff.johnson@liftfoils.com

Contact Jamie for the integration code.
