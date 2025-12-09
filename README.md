# LangChain-Chatbot

A modern, beautiful chatbot application built with Next.js, LangChain, and OpenAI. This project demonstrates how to integrate LangChain with Next.js API routes to create an interactive chatbot experience.

## Features

- 🤖 **LangChain Integration**: Uses LangChain's OpenAI wrapper for AI interactions
- 💬 **Real-time Chat**: Interactive chat interface with message history
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- ⚡ **Next.js 14**: Built with the latest Next.js App Router
- 🔒 **Type-safe**: Full TypeScript support

## Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
lang-chain-sample/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route for chat endpoint
│   ├── globals.css                # Global styles with Tailwind
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main chatbot UI component
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## How It Works

1. **Frontend (`app/page.tsx`)**: 
   - React component with chat UI
   - Manages message state and user input
   - Sends requests to the API route

2. **API Route (`app/api/chat/route.ts`)**:
   - Receives user messages via POST request
   - Uses LangChain's `ChatOpenAI` to interact with OpenAI
   - Returns AI responses to the frontend

3. **LangChain Integration**:
   - Uses `@langchain/openai` package
   - Creates `ChatOpenAI` instance with GPT-3.5-turbo model
   - Processes messages using LangChain's message format

## Customization

- **Change the model**: Edit `app/api/chat/route.ts` and change `modelName` (e.g., `'gpt-4'`)
- **Adjust temperature**: Modify the `temperature` parameter (0.0 to 1.0)
- **Styling**: Customize colors and styles in `app/globals.css` and `tailwind.config.ts`

## Learn More

- [LangChain Documentation](https://js.langchain.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## License

MIT

