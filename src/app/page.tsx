'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Doc {
  slug: string
  folder: string
  title: string
  date: string
}

const folders = ['concepts', 'projects', 'journal']

export default function Home() {
  const [activeFolder, setActiveFolder] = useState('journal')
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocs() {
      setLoading(true)
      try {
        const res = await fetch(`/api/docs/${activeFolder}`)
        const data = await res.json()
        setDocs(data)
      } catch (e) {
        setDocs([])
      }
      setLoading(false)
    }
    fetchDocs()
  }, [activeFolder])

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 p-4">
        <h1 className="text-xl font-bold mb-6 text-emerald-400">🧠 Second Brain</h1>
        
        <nav className="space-y-1">
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
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

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-lg font-semibold mb-4 capitalize">{activeFolder}</h2>
        
        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : docs.length === 0 ? (
          <p className="text-zinc-500">No documents yet. Check back soon!</p>
        ) : (
          <div className="space-y-2">
            {docs.map(doc => (
              <Link
                key={doc.slug}
                href={`/docs/${activeFolder}/${doc.slug}`}
                className="block p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                <h3 className="font-medium text-zinc-100">{doc.title}</h3>
                <p className="text-sm text-zinc-500 mt-1">{doc.date}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
