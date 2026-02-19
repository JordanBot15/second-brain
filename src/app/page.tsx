'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Doc {
  slug: string
  folder: string
  title: string
  date: string
  content: string
}

const folders = ['concepts', 'projects', 'journal']

function DocViewer() {
  const searchParams = useSearchParams()
  const [docs, setDocs] = useState<Doc[]>([])
  const [activeFolder, setActiveFolder] = useState('journal')
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocs() {
      setLoading(true)
      try {
        const res = await fetch('/docs.json')
        const data = await res.json()
        setDocs(data[activeFolder] || [])
      } catch (e) {
        setDocs([])
      }
      setLoading(false)
    }
    fetchDocs()
    
    const folder = searchParams.get('folder')
    const slug = searchParams.get('slug')
    if (folder) setActiveFolder(folder)
    
    if (slug && docs.length > 0) {
      const found = docs.find(d => d.slug === slug)
      if (found) setSelectedDoc(found)
    }
  }, [activeFolder, searchParams])

  const currentDocs = docs

  // If viewing a doc
  if (selectedDoc) {
    return (
      <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
        <aside className="w-64 border-r border-zinc-800 p-4">
          <Link href="/" className="text-xl font-bold mb-6 text-emerald-400 block">
            🧠 Second Brain
          </Link>
          <nav className="space-y-1">
            {folders.map(f => (
              <Link
                key={f}
                href={`/?folder=${f}`}
                className={`block px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                  selectedDoc.folder === f 
                    ? 'bg-zinc-800 text-emerald-400' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                {f}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8 max-w-3xl">
          <Link 
            href={`/?folder=${selectedDoc.folder}`}
            className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold mb-2">{selectedDoc.title}</h1>
          <p className="text-zinc-500 text-sm mb-8">{selectedDoc.date}</p>
          <article className="prose prose-invert prose-zinc max-w-none whitespace-pre-wrap font-sans">
            {selectedDoc.content}
          </article>
        </main>
      </div>
    )
  }

  // List view
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="w-64 border-r border-zinc-800 p-4">
        <h1 className="text-xl font-bold mb-6 text-emerald-400">🧠 Second Brain</h1>
        <nav className="space-y-1">
          {folders.map(folder => (
            <Link
              key={folder}
              href={`/?folder=${folder}`}
              className={`block px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                activeFolder === folder 
                  ? 'bg-zinc-800 text-emerald-400' 
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              {folder}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500">Built with Jordan 🤖</p>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <h2 className="text-lg font-semibold mb-4 capitalize">{activeFolder}</h2>
        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : currentDocs.length === 0 ? (
          <p className="text-zinc-500">No documents yet.</p>
        ) : (
          <div className="space-y-2">
            {currentDocs.map(doc => (
              <Link
                key={doc.slug}
                href={`/?folder=${activeFolder}&slug=${doc.slug}`}
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

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">Loading...</div>}>
      <DocViewer />
    </Suspense>
  )
}
