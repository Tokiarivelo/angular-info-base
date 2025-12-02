'use client';

import { useState, useEffect } from 'react';

interface LinkPreviewProps {
  url: string;
  title: string;
}

interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
}

export default function LinkPreview({ url, title }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          `/api/link-preview?url=${encodeURIComponent(url)}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch metadata');
        }

        const data = await response.json();
        setMetadata(data);
      } catch (err) {
        console.error('Error fetching link metadata:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchMetadata();
    }
  }, [url]);

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="border rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-10 h-10 text-gray-400"
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
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block"
            >
              {url}
            </a>
            <p className="text-xs text-gray-500 mt-1">{getDomain(url)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start space-x-4">
        {metadata.image && (
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={metadata.image}
              alt={metadata.title || title}
              className="w-24 h-24 object-cover rounded"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {metadata.icon && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={metadata.icon}
                alt=""
                className="w-4 h-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <p className="text-xs text-gray-500">{getDomain(url)}</p>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            {metadata.title || title}
          </p>
          {metadata.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {metadata.description}
            </p>
          )}
          <p className="text-xs text-blue-600 mt-2 hover:underline truncate">
            {url}
          </p>
        </div>
      </div>
    </a>
  );
}
