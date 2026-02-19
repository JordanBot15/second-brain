import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const docsDirectory = path.join(process.cwd(), '../workspace-memory')
const outputFile = path.join(process.cwd(), 'public/docs.json')

function getDocsFolders() {
  return ['concepts', 'projects', 'journal']
}

function getDocsByFolder(folder: string) {
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
      const { data, content } = matter(fileContents)
      
      return {
        slug: name.replace(/\.md$/, ''),
        folder,
        title: data.title || name.replace(/\.md$/, ''),
        date: data.date || new Date().toISOString(),
        content: content.slice(0, 500) + (content.length > 500 ? '...' : '')
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const allDocs: Record<string, any[]> = {}

for (const folder of getDocsFolders()) {
  allDocs[folder] = getDocsByFolder(folder)
}

fs.writeFileSync(outputFile, JSON.stringify(allDocs, null, 2))
console.log('Docs exported to public/docs.json')
