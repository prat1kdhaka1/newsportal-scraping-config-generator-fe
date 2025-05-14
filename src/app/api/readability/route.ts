import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid or missing JSON body' }, { status: 400 });
  }

  const { htmlString } = body || {};

  if (!htmlString) {
    return NextResponse.json({ message: 'HTML string is required' }, { status: 400 });
  }

  try {
    const dom = new JSDOM(htmlString);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    const response = {
      title: article?.title || '',
      byline: article?.byline || '',
      dir: article?.dir || null,
      lang: article?.lang || 'ne',
      content: article?.content || '',
      textContent: article?.textContent || '',
      length: article?.length || 0,
      excerpt: article?.excerpt || '',
      siteName: article?.siteName || '',
      publishedTime: article?.publishedTime || new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error processing HTML', error: error?.message },
      { status: 500 }
    );
  }
}
