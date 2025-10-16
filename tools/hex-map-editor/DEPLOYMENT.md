# GitHub Pages Deployment Guide

## Overview

The Hex Map Editor is configured to deploy automatically to GitHub Pages whenever changes are pushed to the `main` branch.

## Deployment URL

Once deployed, the tool will be available at:
```
https://skyreach.github.io/agastia-campaign/tools/hex-map-editor/
```

Repository: https://github.com/Skyreach/agastia-campaign

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Source: **GitHub Actions** (NOT "Deploy from a branch")
5. Click **Save**

### 2. Push Changes

The workflow is already configured. Simply push to main:

```bash
git add .
git commit -m "Add hex map editor"
git push
```

### 3. Monitor Deployment

1. Go to **Actions** tab in your repository
2. You should see "Deploy Hex Map Editor to GitHub Pages" workflow running
3. Wait for it to complete (usually 1-2 minutes)
4. Visit your deployment URL

## How It Works

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy-hex-editor.yml`) automatically:

1. **Triggers on:**
   - Push to `main` branch
   - Changes in `tools/hex-map-editor/` directory
   - Manual workflow dispatch

2. **Build process:**
   - Checks out repository
   - Installs Node.js 20
   - Runs `npm ci` to install dependencies
   - Runs `npm run build` to create production bundle
   - Uploads `dist/` folder as artifact

3. **Deploy process:**
   - Takes built artifact
   - Deploys to GitHub Pages
   - Makes site available at configured URL

### Configuration

**Vite Config (`vite.config.js`):**
```js
export default defineConfig({
  plugins: [react()],
  base: '/agastia-campaign/tools/hex-map-editor/',
})
```

The `base` path ensures assets load correctly on GitHub Pages.

## Manual Deployment

If you prefer manual deployment:

### Option 1: Local Build + Push to gh-pages Branch

```bash
cd tools/hex-map-editor
npm run build
cd ../../

# Copy dist contents to root or gh-pages branch
# Then push gh-pages branch
```

### Option 2: GitHub Actions Manual Trigger

1. Go to **Actions** tab
2. Select "Deploy Hex Map Editor"
3. Click "Run workflow"
4. Select `main` branch
5. Click "Run workflow" button

## Troubleshooting

### Build Fails

Check the Actions logs for errors:
1. Go to Actions tab
2. Click failed workflow
3. Click failed job
4. Expand steps to see error messages

Common issues:
- **Missing dependencies**: Run `npm install` locally first
- **Build errors**: Run `npm run build` locally to test
- **Wrong Node version**: Workflow uses Node 20

### 404 on Deployment URL

1. Verify GitHub Pages is enabled
2. Check that source is set to "GitHub Actions"
3. Confirm workflow completed successfully
4. Wait a few minutes for DNS propagation
5. Try hard refresh (Ctrl+Shift+R)

### Assets Not Loading

1. Check `vite.config.js` has correct `base` path
2. Verify `base` matches your repo name
3. Rebuild after changing config

### Workflow Not Triggering

1. Ensure workflow file is in `.github/workflows/`
2. Check file is on `main` branch
3. Verify you're pushing to `main`
4. Check workflow is enabled in Actions tab

## Development vs Production

### Local Development
```bash
npm run dev
# Runs on http://localhost:5173
# Hot reload enabled
# Dev mode, not optimized
```

### Production Preview
```bash
npm run build
npm run preview
# Runs built version locally
# Tests production build
# Simulates GitHub Pages
```

### Live Production
```
https://<username>.github.io/agastia-campaign/tools/hex-map-editor/
# Deployed version
# Updated on every push to main
# Optimized build
```

## Updating the Tool

1. Make changes to files in `tools/hex-map-editor/`
2. Test locally with `npm run dev`
3. Commit and push to main:
   ```bash
   git add tools/hex-map-editor/
   git commit -m "Update hex editor: <description>"
   git push
   ```
4. Workflow runs automatically
5. Changes live in 1-2 minutes

## Custom Domain (Optional)

To use a custom domain:

1. Add `CNAME` file to `public/` folder:
   ```
   your-domain.com
   ```

2. Update `vite.config.js`:
   ```js
   base: '/', // Remove repo path
   ```

3. Configure DNS with your domain provider:
   - Add CNAME record pointing to `<username>.github.io`

4. In repo Settings → Pages, enter custom domain

## Workflow Permissions

The workflow requires these permissions (already configured):
- `contents: read` - Read repository files
- `pages: write` - Write to GitHub Pages
- `id-token: write` - Required for Pages deployment

These are safe and standard for GitHub Pages deployment.

## Benefits of This Setup

✅ **Zero hosting cost** - GitHub Pages is free
✅ **Automatic updates** - Push to main and it deploys
✅ **Version control** - All changes tracked in git
✅ **No server management** - GitHub handles everything
✅ **Fast CDN** - GitHub's global CDN serves files
✅ **HTTPS included** - Automatic SSL certificates
✅ **Multiple devices** - Access from any browser
✅ **No installation** - Works immediately in browser

## Accessing Your Tool

### From Any Computer
1. Navigate to deployment URL in browser
2. Upload map image or load saved JSON
3. Create and edit hex maps
4. Save work as JSON to download
5. Load JSON file on any device

### Share With Others
Share the deployment URL with your D&D group so they can:
- View your maps
- Create their own maps
- Collaborate on regional maps

## File Storage

**Important:** GitHub Pages serves static files only. All map data is:
- Stored in browser (while editing)
- Exported as JSON files (for saving)
- Imported from JSON files (for loading)

No server-side storage - everything is client-side!

## Security

- No sensitive data stored
- No user accounts or authentication
- All processing happens in browser
- No data sent to any server
- JSON files stay on your computer

Safe to use for D&D campaign maps.

## Summary

Your hex map editor is now deployable to GitHub Pages with:
- ✅ Automatic deployment on push
- ✅ No hosting costs
- ✅ Access from anywhere
- ✅ Easy to update
- ✅ Version controlled
- ✅ Professional URL

Just enable GitHub Pages, push to main, and you're live!
