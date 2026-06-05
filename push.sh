#!/usr/bin/env bash
# ============================================================================
# Metics Design System — one-shot GitHub upload
# Run this from the repo root ON YOUR MAC:  bash push.sh
# Prereqs: git, and Git LFS (install once: brew install git-lfs)
# ============================================================================
set -e
cd "$(dirname "$0")"

# 0. Check Git LFS is installed (the repo has ~240 MB of .ai/.mov binaries)
if ! command -v git-lfs >/dev/null 2>&1; then
  echo "❌ Git LFS not found. Install it first:  brew install git-lfs"
  echo "   (or https://git-lfs.com), then re-run this script."
  exit 1
fi

# 1. Init repo + LFS, commit .gitattributes FIRST so LFS rules apply to binaries
git init -b main
git lfs install
git add .gitattributes
git commit -m "Track binary assets (.ai/.mov/.psd) with Git LFS" || true

# 2. Commit everything
git add .
git commit -m "Metics design system v1: animation kit + asset library + DESIGN.md + examples"

echo
echo "✅ Local repo is committed and LFS-tracked."
echo
echo "Now create the GitHub repo and push. Pick ONE:"
echo
echo "  A) GitHub CLI (creates the repo + pushes in one go):"
echo "       gh repo create metics-media/metics-design-system --private --source=. --push"
echo
echo "  B) Existing empty remote:"
echo "       git remote add origin git@github.com:<your-org>/metics-design-system.git"
echo "       git push -u origin main"
echo
echo "Tip: verify the big files landed in LFS, not git history:  git lfs ls-files | head"
