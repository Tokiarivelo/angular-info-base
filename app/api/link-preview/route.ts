import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
}

// Allowed domains for link preview to prevent SSRF attacks
const ALLOWED_DOMAINS = [
  'github.com',
  'gitlab.com',
  'bitbucket.org',
  'vercel.app',
  'netlify.app',
  'herokuapp.com',
  'pages.dev',
  'github.io',
];

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Check if domain is allowed
    const hostname = parsedUrl.hostname.replace('www.', '');
    const isAllowed = ALLOWED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Domain not allowed for preview' },
        { status: 403 }
      );
    }

    // Fetch the HTML content with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; LinkPreviewBot/1.0; +http://example.com)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }

    const html = await response.text();

    // Extract metadata from HTML
    const metadata: LinkMetadata = {};

    // Extract Open Graph tags
    const ogTitleMatch = html.match(
      /<meta\s+property="og:title"\s+content="([^"]+)"/i
    );
    const ogDescMatch = html.match(
      /<meta\s+property="og:description"\s+content="([^"]+)"/i
    );
    const ogImageMatch = html.match(
      /<meta\s+property="og:image"\s+content="([^"]+)"/i
    );

    // Extract Twitter Card tags
    const twitterTitleMatch = html.match(
      /<meta\s+name="twitter:title"\s+content="([^"]+)"/i
    );
    const twitterDescMatch = html.match(
      /<meta\s+name="twitter:description"\s+content="([^"]+)"/i
    );
    const twitterImageMatch = html.match(
      /<meta\s+name="twitter:image"\s+content="([^"]+)"/i
    );

    // Extract standard meta tags
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const descriptionMatch = html.match(
      /<meta\s+name="description"\s+content="([^"]+)"/i
    );

    // Extract favicon
    const iconMatch = html.match(
      /<link\s+rel="(?:shortcut )?icon"\s+href="([^"]+)"/i
    );

    // Prioritize Open Graph, then Twitter, then standard tags
    metadata.title =
      ogTitleMatch?.[1] || twitterTitleMatch?.[1] || titleMatch?.[1];
    metadata.description =
      ogDescMatch?.[1] || twitterDescMatch?.[1] || descriptionMatch?.[1];
    metadata.image = ogImageMatch?.[1] || twitterImageMatch?.[1];
    metadata.icon = iconMatch?.[1];

    // Make relative URLs absolute
    if (metadata.image && !metadata.image.startsWith('http')) {
      const baseUrl = new URL(url);
      metadata.image = new URL(metadata.image, baseUrl.origin).href;
    }
    if (metadata.icon && !metadata.icon.startsWith('http')) {
      const baseUrl = new URL(url);
      metadata.icon = new URL(metadata.icon, baseUrl.origin).href;
    }

    return NextResponse.json(metadata);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 408 }
      );
    }
    console.error('Link preview error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch link metadata' },
      { status: 500 }
    );
  }
}
