'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Doc {
  slug: string
  folder: string
  title: string
  date: string
  content: string
}

export default function DocPage() {
  const params = useParams()
  const [doc, setDoc] = useState<Doc | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDoc() {
      setLoading(true)
      const folder = params.folder as string
      const slug = params.slug as string
      
      try {
        const res = await fetch(`/api/docs/${folder}/${slug}`)
        const data = await res.json()
        setDoc(data)
      } catch (e) {
        setDoc(null)
      }
      setLoading(false)
    }
    fetchDoc()
  }, [params.folder, params.slug])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-zinc-950 text-zinc-100 p-8">
        <p>Loading...</p>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="flex min-h-screen bg-zinc-950 text-zinc-100 p-8">
        <p>Document not found</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 p-4">
        <Link href="/" className="text-xl font-bold mb-6 text-emerald-400 block">
          🧠 Second Brain
        </Link>
        
        <nav className="space-y-1">
          {['concepts', 'projects', 'journal'].map(f => (
            <Link
              key={f}
              href={`/?folder=${f}`}
              className={`block px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                doc.folder === f 
                  ? 'bg-zinc-800 text-emerald-400' 
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              {f}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 max-w-3xl">
        <Link 
          href="/" 
          className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block"
        >
          ← Back
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
        <p className="text-zinc-500 text-sm mb-8">{doc.date}</p>
        
        <article 
          className="prose prose-invert prose-zinc max-w-none"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />
      </main>
    </div>
  )
}
