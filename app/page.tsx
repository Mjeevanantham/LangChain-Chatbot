'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { extractURLs } from './utils/urlDetector';
import URLPreview from './components/URLPreview';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Show button if user scrolled up more than 100px from bottom
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            🤖 LangChain Chatbot
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Powered by OpenAI & LangChain
          </p>
        </div>
      </header>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide relative"
      >
        {/* Scroll to Bottom Button */}
        <button
          onClick={scrollToBottom}
          className={`fixed bottom-24 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
            showScrollButton 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
          aria-label="Scroll to bottom"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Welcome to LangChain Chatbot
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Start a conversation by typing a message below
              </p>
            </div>
          )}

          {messages.map((message, index) => {
            const urls = extractURLs(message.content);
            
            return (
              <div key={index} className="space-y-2">
                <div
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          AI
                        </div>
                      )}
                      <div className="flex-1 prose prose-slate dark:prose-invert max-w-none break-words">
                        {message.role === 'assistant' ? (
                          <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Headings
                          h1: ({ node, ...props }) => (
                            <h1 className="text-2xl font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-xl font-bold mt-3 mb-2 text-slate-800 dark:text-slate-200" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 className="text-lg font-semibold mt-2 mb-1 text-slate-800 dark:text-slate-200" {...props} />
                          ),
                          // Paragraphs
                          p: ({ node, ...props }) => (
                            <p className="mb-2 text-slate-700 dark:text-slate-300 leading-relaxed" {...props} />
                          ),
                          // Links
                          a: ({ node, ...props }) => (
                            <a
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            />
                          ),
                          // Images
                          img: ({ node, ...props }: any) => (
                            <img
                              className="max-w-full h-auto rounded-lg my-2 shadow-md"
                              alt={props.alt || ''}
                              {...props}
                            />
                          ),
                          // Bold
                          strong: ({ node, ...props }) => (
                            <strong className="font-bold text-slate-900 dark:text-slate-100" {...props} />
                          ),
                          // Italic
                          em: ({ node, ...props }) => (
                            <em className="italic text-slate-800 dark:text-slate-200" {...props} />
                          ),
                          // Highlight/Mark
                          mark: ({ node, ...props }) => (
                            <mark className="bg-yellow-300 dark:bg-yellow-600 text-slate-900 dark:text-slate-100 px-1 rounded" {...props} />
                          ),
                          // Strikethrough
                          del: ({ node, ...props }) => (
                            <del className="line-through text-slate-500 dark:text-slate-400" {...props} />
                          ),
                          // Code blocks (pre contains code)
                          pre: ({ node, children, ...props }: any) => {
                            const codeProps = (children as any)?.props || {};
                            const match = /language-(\w+)/.exec(codeProps.className || '');
                            const codeString = String(codeProps.children || '').replace(/\n$/, '');
                            
                            if (match) {
                              return (
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  className="rounded-lg my-2 !bg-slate-900"
                                  customStyle={{
                                    margin: 0,
                                    borderRadius: '0.5rem',
                                  }}
                                  {...props}
                                >
                                  {codeString}
                                </SyntaxHighlighter>
                              );
                            }
                            
                            return (
                              <pre className="my-2 rounded-lg overflow-x-auto bg-slate-900 text-slate-100 p-4" {...props}>
                                {children}
                              </pre>
                            );
                          },
                          // Code inline
                          code: ({ node, inline, className, children, ...props }: any) => {
                            if (inline) {
                              return (
                                <code
                                  className="bg-slate-200 dark:bg-slate-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }
                            return <code className={className} {...props}>{children}</code>;
                          },
                          // Lists
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc list-inside mb-2 space-y-1 text-slate-700 dark:text-slate-300" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal list-inside mb-2 space-y-1 text-slate-700 dark:text-slate-300" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="ml-4 text-slate-700 dark:text-slate-300" {...props} />
                          ),
                          // Blockquotes
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="border-l-4 border-blue-500 pl-4 my-2 italic text-slate-600 dark:text-slate-400"
                              {...props}
                            />
                          ),
                          // Horizontal rule
                          hr: ({ node, ...props }) => (
                            <hr className="my-4 border-slate-300 dark:border-slate-600" {...props} />
                          ),
                          // Tables
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-2">
                              <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600" {...props} />
                            </div>
                          ),
                          thead: ({ node, ...props }) => (
                            <thead className="bg-slate-100 dark:bg-slate-800" {...props} />
                          ),
                          tbody: ({ node, ...props }) => (
                            <tbody {...props} />
                          ),
                          tr: ({ node, ...props }) => (
                            <tr className="border-b border-slate-300 dark:border-slate-600" {...props} />
                          ),
                          th: ({ node, ...props }) => (
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left font-bold text-slate-800 dark:text-slate-200" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300" {...props} />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap break-words text-white">
                        {message.content}
                      </p>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      You
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* URL Previews */}
            {urls.length > 0 && (
              <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[80%] space-y-2">
                  {urls.map((url, urlIndex) => (
                    <URLPreview key={urlIndex} url={url} />
                  ))}
                </div>
              </div>
            )}
          </div>
          );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-700 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    AI
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors duration-200 shadow-md hover:shadow-lg disabled:shadow-none flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span>Send</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

