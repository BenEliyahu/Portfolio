# Ben Eliyahu - Portfolio

A modern, interactive portfolio built with Next.js, Three.js, Tailwind CSS, and powered by Claude AI. Features a 3D hero section, project showcase, and an AI chatbot assistant.

## 🚀 Features

- **3D Hero Section** - Stunning Three.js rendering with interactive cube and animations
- **Project Showcase** - Display of 5 featured projects with technologies and GitHub links
- **AI Chatbot** - Claude-powered assistant that answers questions about projects and skills
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Smooth Animations** - Framer Motion for elegant transitions
- **Dark Theme** - Professional slate color scheme

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **3D Graphics**: Three.js, @react-three/fiber
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Anthropic API key (get from [console.anthropic.com](https://console.anthropic.com))

## 🏃 Getting Started

1. **Clone the repository**
```bash
git clone <your-repo>
cd porfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Building for Production

```bash
npm run build
npm start
```

## 🚀 Deploy to Vercel

The easiest deployment option:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Connect your GitHub repository
4. Add the `ANTHROPIC_API_KEY` environment variable in Vercel settings
5. Deploy!

Or deploy with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BenEliyahu/porfolio)

## 📝 Customization

### Adding Projects
Edit `app/components/Projects.tsx` and add your projects to the `projects` array.

### Updating About Section
Modify `app/components/About.tsx` to update your bio and statistics.

### Changing Skills
Edit `app/components/Skills.tsx` to add or remove technical skills.

### AI Chatbot System Prompt
Update the `systemPrompt` in `app/api/chat/route.ts` to customize the AI assistant's behavior.

## 📧 Contact

For questions or feedback, reach out via the contact form on the portfolio or:
- Email: beneliyahu15@gmail.com
- LinkedIn: [linkedin.com/in/ben-eliyahu](https://linkedin.com/in/ben-eliyahu)
- GitHub: [github.com/BenEliyahu](https://github.com/BenEliyahu)

## 📄 License

This project is open source and available under the MIT License.
