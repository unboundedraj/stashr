import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { extractMetaImage, isFetchableUrl } from '@/lib/meta-image-extractor';

// GET /api/meta-image?url=... - Extract meta image for a given URL using metascraper
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL format and make sure it points at a public http(s) host
    if (!isFetchableUrl(url)) {
      return NextResponse.json(
        { error: 'Please provide a valid public http(s) URL' },
        { status: 400 }
      );
    }

    console.log(`🔍 API: Extracting meta image with metascraper for: ${url}`);

    // Extract meta image using metascraper
    const result = await extractMetaImage(url);

    console.log(`✅ API: Metascraper extraction result:`, {
      success: result.success,
      fallbackUsed: result.fallbackUsed,
      hasImageUrl: !!result.imageUrl,
      imageFound: !!result.imageUrl
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('❌ API: Error extracting meta image:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to extract meta image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 