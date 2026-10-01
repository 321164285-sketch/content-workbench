import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { IContent } from '../types'
import { fetchContents } from '../api/content'

interface Overrides {
  added: IContent[]
  updated: Record<number, Partial<IContent>>
  deleted: number[]
}

interface ContentContextValue {
  contents: IContent[]
  loading: boolean
  error: string | null
  addContent: (item: Omit<IContent, 'id'>) => IContent
  updateContent: (id: number, patch: Partial<IContent>) => void
  deleteContent: (id: number) => void
}

const STORAGE_KEY = 'cwb-content-overrides-v1'
const ContentContext = createContext<ContentContextValue | null>(null)

function loadOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { added: [], updated: {}, deleted: [] }
    const parsed = JSON.parse(raw) as Partial<Overrides>
    return {
      added: parsed.added ?? [],
      updated: parsed.updated ?? {},
      deleted: parsed.deleted ?? [],
    }
  } catch {
    return { added: [], updated: {}, deleted: [] }
  }
}

function persistOverrides(overrides: Overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Storage unavailable (private mode etc.) — CRUD still works for the session.
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [base, setBase] = useState<IContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<Overrides>(loadOverrides)

  useEffect(() => {
    let cancelled = false
    fetchContents()
      .then((data) => {
        if (cancelled) return
        setBase(data)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : '加载失败')
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const contents = useMemo(() => {
    const { added, updated, deleted } = overrides
    const merged = base.map((item) => (updated[item.id] ? { ...item, ...updated[item.id] } : item))
    const filtered = merged.filter((item) => !deleted.includes(item.id))
    return [...added, ...filtered]
  }, [base, overrides])

  const commitOverrides = (next: Overrides) => {
    setOverrides(next)
    persistOverrides(next)
  }

  const addContent = (item: Omit<IContent, 'id'>): IContent => {
    const id = Date.now()
    const created: IContent = { ...item, id }
    commitOverrides({ ...overrides, added: [...overrides.added, created] })
    return created
  }

  const updateContent = (id: number, patch: Partial<IContent>) => {
    commitOverrides({
      ...overrides,
      updated: { ...overrides.updated, [id]: { ...overrides.updated[id], ...patch } },
    })
  }

  const deleteContent = (id: number) => {
    commitOverrides({ ...overrides, deleted: [...overrides.deleted, id] })
  }

  const value: ContentContextValue = {
    contents,
    loading,
    error,
    addContent,
    updateContent,
    deleteContent,
  }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
