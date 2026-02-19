'use client'

import Link from 'next/link'

interface Doc {
  slug: string
  folder: string
  title: string
  date: string
}

interface SidebarProps {
  activeFolder: string
  folders: string[]
  onFolderChange: (folder: string) => void
}

export function Sidebar({ activeFolder, folders, onFolderChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-zinc-800 p-4">
      <h1 className="text-xl font-bold mb-6 text-emerald-400">🧠 Second Brain</h1>
      
      <nav className="space-y-1">
        {folders.map(folder => (
          <button
            key={folder}
            onClick={() => onFolderChange(folder)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeFolder === folder 
                ? 'bg-zinc-800 text-emerald-400' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            {folder}
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500">Built with Jordan 🤖</p>
      </div>
    </aside>
  )
}

interface DocListProps {
  docs: Doc[]
}

export function DocList({ docs }: DocListProps) {
  return (
    <main className="flex-1 p-6">
      {docs.length === 0 ? (
        <p className="text-zinc-500">No documents yet. Check back soon!</p>
      ) : (
        <div className="space-y-2">
          {docs.map(doc => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.folder}/${doc.slug}`}
              className="block p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              <h3 className="font-medium text-zinc-100">{doc.title}</h3>
              <p className="text-sm text-zinc-500 mt-1">{doc.date}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
