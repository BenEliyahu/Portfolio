# 🚀 Deployment Guide - Ben's AI-Powered Portfolio

Your portfolio is ready to deploy! Follow these steps to get it live on Vercel.

## Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial portfolio: 3D hero, 5 projects, OpenAI chatbot, stunning design"

# Create a GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/porfolio.git
git branch -M main
git push -u origin main
```

## Step 2: Get Your OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in to OpenAI
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. **Save it somewhere safe** - you won't see it again

## Step 3: Deploy to Vercel

### Option A: One-Click Deploy (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Paste your GitHub URL: `https://github.com/YOUR_USERNAME/porfolio.git`
4. Click "Import"
5. In "Environment Variables", add:
   - Name: `OPENAI_API_KEY`
   - Value: Your key from Step 2 (sk-...)
6. Click "Deploy"
7. Wait 2-3 minutes for deployment ✨

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow prompts and add `OPENAI_API_KEY` when asked.

### Option C: Manual Vercel Setup

1. Push code to GitHub
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "New Project" → Import your repo
4. Settings → Environment Variables
5. Add: `OPENAI_API_KEY` = `sk-...`
6. Click "Deploy"

## Step 4: Test Your Portfolio

Once live:
- ✅ 3D rotating sphere with multiple objects
- ✅ Smooth animations and glowing effects
- ✅ 5 project cards with hover effects
- ✅ AI chatbot (bottom right) - ask about projects!
- ✅ Contact form with validation
- ✅ Mobile responsive design
- ✅ Dark theme with neon accents

## Step 5: Custom Domain (Optional)

1. In Vercel project → Settings → Domains
2. Add your custom domain
3. Configure DNS settings (Vercel will guide you)

## 📝 Post-Deployment Checklist

- [ ] Portfolio loads with 3D animation
- [ ] All 5 projects display correctly
- [ ] Chatbot responds to messages
- [ ] Contact form submits
- [ ] Mobile looks great
- [ ] No console errors

## 🔧 Making Changes

Update anytime - Vercel auto-deploys on push:

```bash
# Edit any file (e.g., add a new project)
# Then commit and push
git add .
git commit -m "Update portfolio"
git push origin main

# Vercel redeploys in 1-2 minutes!
```

## 💡 Customization Tips

| Want to change... | Edit file... |
|---|---|
| Projects | `app/components/Projects.tsx` |
| Skills/Tech | `app/components/Skills.tsx` |
| About section | `app/components/About.tsx` |
| Contact info | `app/components/Contact.tsx` |
| AI chatbot personality | `app/api/chat/route.ts` (systemPrompt) |
| 3D hero effects | `app/components/Hero3D.tsx` |

## ❓ Troubleshooting

### Chatbot not responding?
- ✅ Check API key in Vercel Settings (copy-paste exactly)
- ✅ Verify key is active at [platform.openai.com](https://platform.openai.com)
- ✅ Check Vercel deployment logs for errors

### 3D not loading?
- Normal on older browsers (use Chrome/Edge)
- Fallback still displays your name and info

### Build failed?
- Check Vercel build logs
- Ensure all components are properly imported
- Run locally first: `npm run dev`

## 🎉 You're Live!

Your portfolio is now showcasing your skills to the world!

**Share with:**
- Recruiters & hiring managers
- On your LinkedIn profile
- GitHub profile README
- Your resume/CV

**What makes it special:**
- 🎨 Stunning 3D animations
- 🤖 OpenAI-powered chatbot
- 💎 Professional neon design
- ⚡ Fast & responsive
- 🌙 Beautiful dark theme

---

**Questions?** Check the [README.md](README.md) or try the AI chatbot on your portfolio! 🚀
