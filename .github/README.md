# Auto-Publish Workflow

## Setup (One Time)

1. **Get a Personal Access Token**:
   - Go to https://dev.azure.com
   - Create a new token with **Marketplace (Manage)** permission

2. **Add to GitHub**:
   - Go to your repo → Settings → Secrets → Actions
   - Add secret: `VSCE_PAT` = your token

## How It Works

When you push a version change to `main`, the extension automatically publishes:

```bash
# 1. Update version
npm version patch  # or minor, or major

# 2. Commit and push
git add .
git commit -m "Release v0.0.2"
git push origin main

# ✅ Auto-publishes to VS Code Marketplace!
```

That's it! Simple and automatic.
