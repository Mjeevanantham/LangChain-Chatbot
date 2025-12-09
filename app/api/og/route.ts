import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the webpage
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch URL' },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const ogData: OGData = {
      url: validUrl.toString(),
    };

    // Extract Open Graph tags
    ogData.title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      '';

    ogData.description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    ogData.image =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      '';

    ogData.siteName =
      $('meta[property="og:site_name"]').attr('content') ||
      validUrl.hostname ||
      '';

    // Convert relative image URLs to absolute
    if (ogData.image && !ogData.image.startsWith('http')) {
      try {
        ogData.image = new URL(ogData.image, validUrl.origin).toString();
      } catch {
        // If conversion fails, keep original
      }
    }

    return NextResponse.json(ogData);
  } catch (error: any) {
    console.error('Error fetching OG data:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching URL metadata' },
      { status: 500 }
    );
  }
}

