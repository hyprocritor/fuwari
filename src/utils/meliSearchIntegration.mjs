import {readFile, readdir} from 'node:fs/promises'
import path from 'node:path'
import dotenv from 'dotenv'
import {JSDOM} from 'jsdom'
import {MeiliSearch} from 'meilisearch'
import {nanoid} from 'nanoid'

dotenv.config()
const siteUrl = process.env.PUBLIC_SITE_URL
const searchMasterKey = process.env.MEILISEARCH_MASTER_KEY || 'MasterKey'

const searchInternalUrl = process.env.MELISEARCH_INTERNAL_URL
const cloudflareAccessId = process.env.CLOUDFLARE_ACCESS_CLIENT_ID
const cloudflareAccessSecret = process.env.CLOUDFLARE_ACCESS_CLIENT_SECRET

const client = new MeiliSearch({
    host: searchInternalUrl, apiKey: searchMasterKey, requestConfig: {
        headers: {
            "CF-Access-Client-Id": cloudflareAccessId,
            "CF-Access-Client-Secret": cloudflareAccessSecret
        }
    }
})

async function getPosts() {
    const postsDirectory = path.join(process.cwd(), 'dist', 'posts')
    const folders = await readdir(postsDirectory)

    const posts = await Promise.all(
        folders.map(async folderName => {
            const filePath = path.join(postsDirectory, folderName, 'index.html')
            const source = await readFile(filePath, 'utf-8')

            // Parse HTML content using JSDOM
            const dom = new JSDOM(source)
            const document = dom.window.document

            // Get the main content
            const contentElement = document.querySelector('.markdown-content')
            const content = contentElement ? contentElement.textContent.trim() : ''

            // Get metadata from JSON-LD
            const scriptElement = document.querySelector(
                'script[type="application/ld+json"]',
            )
            const metadata = scriptElement
                ? JSON.parse(scriptElement.textContent)
                : {}

            return {
                id: nanoid(),
                content,
                title: metadata.headline || '',
                description: metadata.description || '',
                keywords: metadata.keywords || [],
                author: metadata.author?.name || '',
                datePublished: metadata.datePublished || '',
                language: metadata.inLanguage || 'en',
                url: `${siteUrl}/posts/${folderName}`,
            }
        }),
    )

    return posts
}

// Main execution
async function main() {
    const posts = await getPosts()
    const indexName = 'articles'

    // Get the index instance
    const index = await client.getIndex(indexName)
    console.log("Get Index Complete: ", index.uid)

    await index.deleteAllDocuments()
    console.log("Deleted All Documents.")
    // Add documents to the index
    await index.addDocuments(posts)
    console.log("Added new Documents.")
}

main().catch(console.error)

