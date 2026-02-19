import 'server-only'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const docsDirectory = path.join(process.cwd(), '../workspace-memory')

export function getDocsFolders() {
  return ['concepts', 'projects', 'journal']
}

export function getDocsByFolder(folder: string) {
  const folderPath = path.join(docsDirectory, folder)
  
  if (!fs.existsSync(folderPath)) {
    return []
  }
  
  const fileNames = fs.readdirSync(folderPath)
  
  return fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const fullPath = path.join(folderPath, name)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      
      return {
        slug: name.replace(/\.md$/, ''),
        folder,
        title: data.title || name.replace(/\.md$/, ''),
        date: data.date || new Date().toISOString(),
        preview: fileContents.slice(0, 150) + '...'
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getDocContent(folder: string, slug: string) {
  const fullPath = path.join(docsDirectory, folder, `${slug}.md`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  const processedContent = await remark()
    .use(html)
    .process(content)
  
  return {
    slug,
    folder,
    title: data.title || slug,
    date: data.date,
    content: processedContent.toString()
  }
}
