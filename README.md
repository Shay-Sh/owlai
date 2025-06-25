# 🦉 OwlAI - Your AI-Powered Second Brain

OwlAI is your intelligent knowledge companion. Save what matters, let AI summarize and organize it for you. From articles to ideas, OwlAI turns your digital mess into organized intelligence.

> 🚀 **Now with database integration** - Ready for production use!

## ✨ Features

- 🧠 **Smart Summarization** - AI-powered summaries that capture the essence of your content
- 🏷️ **Auto-Tagging** - Intelligent categorization with relevant topics and keywords  
- 🔎 **Full-Text Search** - Find any piece of information instantly with powerful search
- 🔗 **Chrome Extension** - One-click saving from any webpage in your browser
- 🔐 **Secure Cloud Sync** - Your knowledge is safely stored and synced across all devices
- 💡 **Simple, Clean Interface** - Distraction-free design that focuses on your content

## 🎯 Use Cases

- **Founders**: Save strategic content, investor tips, market insights
- **Researchers**: Curate topic-specific knowledge
- **Writers & Creators**: Organize inspiration and reference links
- **Lifelong Learners**: Build your own AI-powered knowledge graph

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **AI Processing**: [n8n](https://n8n.io/) workflows with OpenAI/Claude
- **Payments**: [LemonSqueezy](https://lemonsqueezy.com/) integration
- **UI**: [shadcn/ui](https://ui.shadcn.com/) with [Tailwind CSS](https://tailwindcss.com/)
- **Auth**: JWT-based authentication with secure sessions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- n8n instance (for AI processing)

### Installation

```bash
git clone https://github.com/Shay-Sh/owlai.git
cd owlai
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
# Database
POSTGRES_URL="your_postgres_connection_string"

# Auth
AUTH_SECRET="your_secure_random_string"

# AI Processing
N8N_WEBHOOK_URL="your_n8n_webhook_endpoint"
N8N_WEBHOOK_SECRET="your_webhook_secret"

# Payments (optional)
LEMONSQUEEZY_API_KEY="your_lemonsqueezy_key"
```

### Database Setup

```bash
# Run database migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see OwlAI in action.

## 🤖 AI Workflow Setup

OwlAI uses n8n workflows for AI processing. When content is submitted:

1. **Content Extraction** - URLs are scraped, text content is prepared
2. **AI Summarization** - OpenAI/Claude generates concise summaries
3. **Smart Tagging** - AI extracts relevant topics and categories
4. **Storage** - Processed content is saved to your knowledge vault

Set up your n8n workflow to receive webhooks at `/api/webhook/n8n` and process content accordingly.

## 📱 Chrome Extension

*Coming soon* - One-click content saving directly from your browser.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

- `POSTGRES_URL` - Production database URL
- `AUTH_SECRET` - Secure random string for JWT signing
- `N8N_WEBHOOK_URL` - Your n8n webhook endpoint
- `N8N_WEBHOOK_SECRET` - Webhook authentication secret

## 🛣️ Roadmap

- [ ] 🧩 Chrome Extension
- [ ] 🔄 Version tracking for updated links
- [ ] 👥 Team spaces with shared vaults  
- [ ] 🔍 Semantic search with vector embeddings
- [ ] 💬 GPT Q&A over personal knowledge base
- [ ] 📱 Mobile app
- [ ] 📊 Advanced analytics and insights

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for knowledge enthusiasts everywhere**