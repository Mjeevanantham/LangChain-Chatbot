'use client';

import { useState, useEffect } from 'react';

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
}

interface URLPreviewProps {
  url: string;
}

export default function URLPreview({ url }: URLPreviewProps) {
  const [ogData, setOgData] = useState<OGData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOGData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/og', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch preview');
        }

        setOgData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load preview');
      } finally {
        setLoading(false);
      }
    };

    fetchOGData();
  }, [url]);

  if (loading) {
    return (
      <div className="border border-slate-300 dark:border-slate-600 rounded-lg p-4 my-2 bg-slate-50 dark:bg-slate-800 animate-pulse">
        <div className="flex gap-3">
          <div className="w-24 h-24 bg-slate-300 dark:bg-slate-700 rounded flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ogData) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block border border-slate-300 dark:border-slate-600 rounded-lg p-3 my-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <span className="text-blue-600 dark:text-blue-400 text-sm break-all">
            {url}
          </span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden my-2 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow"
    >
      {ogData.image && (
        <div className="relative w-full h-48 bg-slate-200 dark:bg-slate-700">
          <img
            src={ogData.image}
            alt={ogData.title || 'Preview image'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-4">
        {ogData.siteName && (
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            {ogData.siteName}
          </p>
        )}
        {ogData.title && (
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
            {ogData.title}
          </h3>
        )}
        {ogData.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
            {ogData.description}
          </p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {new URL(url).hostname}
        </p>
      </div>
    </a>
  );
}

