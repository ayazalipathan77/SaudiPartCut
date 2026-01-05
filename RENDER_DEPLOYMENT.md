# Render Deployment Guide for SaudiPartConfig

## Quick Fix for Your Current Error

Your app is now configured to work as a **Web Service** on Render. The error was happening because Render was looking for `server.js` but it didn't exist.

### What I Fixed:
1. ✅ Created `server.js` - Express server to serve the React app
2. ✅ Added `express` dependency to `package.json`
3. ✅ Added `start` script to run the server

---

## Render Configuration Settings

Use these settings in your Render dashboard:

### Build Settings
```
Build Command: npm install && npm run build
Start Command: npm start
```

### Environment Variables
```
NODE_ENV=production
```

### Other Settings
- **Branch:** main (or your default branch)
- **Root Directory:** (leave blank)
- **Auto-Deploy:** Yes (recommended)

---

## Deployment Steps

### 1. Commit and Push Changes

```bash
# Add the new files
git add server.js package.json RENDER_DEPLOYMENT.md

# Commit
git commit -m "feat: Add Express server for Render deployment"

# Push to your repository
git push origin main
```

### 2. Configure Render (if not already done)

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your service
3. Go to **Settings**
4. Update:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Click **Save Changes**

### 3. Manual Deploy (if needed)

- Click **"Manual Deploy"** → **"Deploy latest commit"**

### 4. Monitor Deployment

Watch the logs for:
```
Server is running on port 10000
```

---

## Verify Deployment Works

After deployment completes, test these:

1. **Homepage loads:** Visit your `.onrender.com` URL
2. **Login works:** Use `admin@saudipart.com` / `admin`
3. **Wizard works:** Configure a part through all 5 steps
4. **3D preview works:** Check WebGL renders properly
5. **Admin dashboard:** Verify you can edit pricing

---

## Troubleshooting

### If deployment still fails:

**Check build logs for errors:**
- Look for `npm install` errors
- Look for `vite build` errors
- Ensure `dist/` folder is created

**Common issues:**

1. **"Cannot find module 'express'"**
   - Solution: Make sure you committed `package.json` with express dependency
   - Run: `git add package.json && git commit -m "Add express" && git push`

2. **"dist folder not found"**
   - Solution: Build command must be `npm install && npm run build`
   - Verify in Render Settings → Build Command

3. **App loads but routes don't work**
   - This should be fixed by the `server.js` catch-all route
   - The server sends `index.html` for all routes

4. **Port already in use**
   - Render automatically sets `PORT` environment variable
   - Our server uses `process.env.PORT || 3000`

---

## Alternative: Deploy as Static Site

If you prefer a simpler deployment without a server:

### Option A: Static Site (Simpler, Cheaper, Faster)

1. **Delete current Web Service** on Render
2. **Create new "Static Site"** instead
3. Use these settings:
   ```
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
4. Add **Rewrite Rule** for SPA routing:
   ```
   Source: /*
   Destination: /index.html
   Action: Rewrite
   ```

**Pros:**
- Faster (served from CDN)
- Cheaper (Static Sites are free on Render)
- No server maintenance

**Cons:**
- No server-side logic (but you don't need it for this demo)

---

## Next Steps After Deployment

### 1. Custom Domain (Optional)
- In Render: Settings → Custom Domains
- Add your domain
- Update DNS with CNAME record
- SSL automatically provisioned

### 2. Environment Variables
Currently none needed, but for future:
```
NODE_ENV=production
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 3. Performance Monitoring
- Check Render's built-in metrics
- Add Google Analytics (optional)
- Monitor error logs

---

## Current Deployment Status

✅ **Fixed:** Express server added
✅ **Ready:** App configured for Render Web Service
🔄 **Next:** Push changes and redeploy

---

## Support

**Render Documentation:**
- [Deploy Node.js Apps](https://render.com/docs/deploy-node-express-app)
- [Static Sites](https://render.com/docs/static-sites)
- [Troubleshooting](https://render.com/docs/troubleshooting-deploys)

**Project Issues:**
- Check `git status` to ensure all changes are committed
- Check Render logs for specific error messages
- Verify `dist/` folder exists after build

---

**Last Updated:** January 5, 2026
