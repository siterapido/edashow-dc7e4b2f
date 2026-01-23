import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(req: Request) {
    try {
        const { url } = await req.json()

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 })
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
                { status: response.status }
            )
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        // Remove scripts, styles, and unwanted elements
        $('script').remove()
        $('style').remove()
        $('nav').remove()
        $('footer').remove()
        $('iframe').remove()
        $('.ad').remove()
        $('[class*="menu"]').remove()
        $('[class*="sidebar"]').remove()
        $('[class*="comment"]').remove()

        // Extract title
        const title = $('h1').first().text().trim() || $('title').text().trim()

        // Extract content - heuristic: find the element with the most text
        let content = ''
        const potentialContentSelectors = ['article', 'main', '.post-content', '.entry-content', '#content', '.content']
        
        for (const selector of potentialContentSelectors) {
            const el = $(selector)
            if (el.length > 0) {
                content = el.text().trim().replace(/\s+/g, ' ')
                break
            }
        }

        // Fallback: look for paragraphs if no main container found
        if (!content) {
            content = $('p').map((i, el) => $(el).text()).get().join('\n\n')
        }

        return NextResponse.json({
            title,
            content: content.trim()
        })

    } catch (error: any) {
        console.error('Fetch error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch content' },
            { status: 500 }
        )
    }
}
