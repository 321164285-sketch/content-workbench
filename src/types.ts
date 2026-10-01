export type ContentStatus = 'published' | 'draft' | 'archived'

export interface IContent {
  id: number
  title: string
  category: string
  status: ContentStatus
  summary: string
  createdAt: string // ISO date, e.g. "2026-09-15"
}

export const CATEGORIES = ['Tech', 'Marketing', 'Design', 'Business', 'Lifestyle'] as const

export const STATUS_LABELS: Record<ContentStatus, string> = {
  published: '已发布',
  draft: '草稿',
  archived: '已归档',
}
