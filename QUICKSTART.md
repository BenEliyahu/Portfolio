# ⚡ Quick Start - 5 Minutes to Live

Get your stunning portfolio running locally and deployed to Vercel.

## 📋 Prerequisites

- **Node.js 18+** — [Download here](https://nodejs.org)
- **OpenAI API key** — [Get free key here](https://platform.openai.com/api-keys)
- **GitHub account** — For pushing code (free at [github.com](https://github.com))

## 🚀 Step 1: Get Your API Key (2 min)

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy your key (looks like: `sk-proj-abc123...`)
4. Keep it safe!

## 🔧 Step 2: Setup Locally (2 min)

```bash
# Navigate to portfolio folder
cd c:\Users\bene\Desktop\ben\porfolio

# Edit .env.local file and replace:
# OPENAI_API_KEY=your_openai_api_key_here
#
# With your actual key:
# OPENAI_API_KEY=sk-proj-abc123...

# Start dev server
npm run dev
```

✅ You should see:
```
- Local:        http://localhost:3000
```

## 🌐 Step 3: Open in Browser

Visit **[http://localhost:3000](http://localhost:3000)**

You'll see:
- ✨ 3D rotating sphere with glowing effects
- 🎨 Neon gradient text and animations
- 📱 Responsive design (try resizing!)
- 🤖 AI chatbot (bottom right) — ask it questions!
- 🎯 All 5 of your projects with hover effects

## 💬 Test the Chatbot

Click the blue chat bubble and try asking:
- "Tell me about the Phone Store project"
- "What's Ben's experience level?"
- "What technologies does he use?"

Watch the AI respond in real-time! 🤖

## 📝 Make Changes

Edit files in `app/components/` and the page updates instantly:
- `Hero3D.tsx` — 3D animations
- `Projects.tsx` — Your projects
- `Skills.tsx` — Tech stack
- `About.tsx` — Your bio
- `Contact.tsx` — Contact info

## 🚀 Step 4: Deploy to Vercel (1 min)

When ready to go live, follow [DEPLOYMENT.md](DEPLOYMENT.md):

```bash
# Push to GitHub
git add .
git commit -m "Amazing portfolio ready!"
git push origin main

# Then go to vercel.com/new → Import → Add OPENAI_API_KEY
# Done! Your portfolio is live! 🎉
```

---

## ⚡ TL;DR

```bash
cd c:\Users\bene\Desktop\ben\porfolio
# Edit .env.local with your API key
npm run dev
# Visit http://localhost:3000
# When ready: Follow DEPLOYMENT.md
```

Need help? Check [README.md](README.md) 📖
