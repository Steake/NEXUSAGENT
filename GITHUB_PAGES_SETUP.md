# GitHub Pages Setup Instructions

This document provides step-by-step instructions for configuring GitHub Pages for the NEXUSAGENT repository.

## Prerequisites

- Repository must be public (or you must have GitHub Pro/Enterprise for private repos)
- You must have admin access to the repository

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/Steake/NEXUSAGENT`
2. Click on **Settings** (gear icon at the top)
3. In the left sidebar, click on **Pages** (under "Code and automation")
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - This will enable the workflow-based deployment

### 2. Merge the Pull Request

1. Merge this pull request to the `main` branch
2. The GitHub Actions workflow will automatically trigger
3. Wait for the workflow to complete (check the "Actions" tab)

### 3. Verify Deployment

1. After the workflow completes successfully:
   - Go to **Settings** → **Pages**
   - You should see a message: "Your site is live at `https://steake.github.io/NEXUSAGENT/`"
2. Click the link to view your deployed site
3. It may take a few minutes for the site to become available

### 4. Badge Status

The README includes a deployment status badge that will show:
- ✅ Green: Deployment successful
- ❌ Red: Deployment failed
- 🟡 Yellow: Deployment in progress

## Manual Deployment

You can manually trigger a deployment:

1. Go to the **Actions** tab
2. Click on "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select the branch (main)
5. Click "Run workflow"

## Troubleshooting

### Issue: Workflow fails with permissions error

**Solution**: Ensure GitHub Actions has write permissions:
1. Go to **Settings** → **Actions** → **General**
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Save changes

### Issue: 404 error when accessing the site

**Solution**: 
1. Check that the base path in `vite.config.ts` matches the repository name
2. Verify the workflow completed successfully
3. Clear browser cache and try again
4. Check that the `.nojekyll` file is present in the deployment

### Issue: Assets not loading (CSS/JS)

**Solution**: 
- This is usually a base path issue
- The `vite.config.ts` is configured to use `/NEXUSAGENT/` as the base path
- Verify the `GITHUB_ACTIONS` environment variable is being set in the workflow

## Configuration Details

### Vite Configuration

The `vite.config.ts` file includes:
```typescript
base: process.env.GITHUB_ACTIONS ? '/NEXUSAGENT/' : '/',
```

This ensures:
- Local development uses `/` as base
- GitHub Actions deployment uses `/NEXUSAGENT/` as base

### Workflow Configuration

The `.github/workflows/deploy.yml` includes:
- **Trigger**: Runs on push to `main` branch or manual dispatch
- **Permissions**: Configured for Pages deployment
- **Concurrency**: Prevents multiple simultaneous deployments
- **Node.js**: Version 20 with npm caching
- **Build**: Sets `GITHUB_ACTIONS=true` environment variable
- **Deploy**: Uses official `actions/deploy-pages@v4`

## Post-Deployment

Once deployed, you can:
1. Share the live URL: `https://steake.github.io/NEXUSAGENT/`
2. Update the README with the correct live demo link
3. Add custom domain (optional, see GitHub Pages docs)

## Notes

- The site will automatically redeploy on every push to `main`
- Build time is typically 1-2 minutes
- The `dist` folder is gitignored (not committed to repo)
- Only the built artifacts are deployed to the `gh-pages` branch (managed automatically)

## Support

If you encounter issues:
1. Check the Actions tab for workflow logs
2. Review the troubleshooting section above
3. Consult [GitHub Pages documentation](https://docs.github.com/en/pages)
4. Open an issue in the repository
