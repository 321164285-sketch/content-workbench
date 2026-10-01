import { useMemo, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { STATUS_LABELS } from '../types'

const WEEK_HEADERS = ['日', '一', '二', '三', '四', '五', '六']

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function isSameMonth(d: Date, year: number, month: number): boolean {
  return d.getFullYear() === year && d.getMonth() === month
}

export default function Calendar() {
  const { contents } = useContent()
  const today = new Date()
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<string | null>(null)

  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const cells = useMemo(() => {
    const first = new Date(year, month, 1)
    const startOffset = first.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const result: (Date | null)[] = []
    for (let i = 0; i < startOffset; i++) result.push(null)
    for (let d = 1; d <= daysInMonth; d++) result.push(new Date(year, month, d))
    while (result.length % 7 !== 0) result.push(null)
    return result
  }, [year, month])

  const byDate = useMemo(() => {
    const map: Record<string, typeof contents> = {}
    contents.forEach((c) => {
      const key = c.createdAt
      ;(map[key] ||= []).push(c)
    })
    return map
  }, [contents])

  const monthLabel = `${year} 年 ${month + 1} 月`
  const selectedItems = selected ? byDate[selected] ?? [] : []

  const move = (delta: number) => {
    setCursor(new Date(year, month + delta, 1))
    setSelected(null)
  }

  const goToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelected(today.toISOString().slice(0, 10))
  }

  return (
    <div className="calendar-layout">
      <div className="panel calendar-panel">
        <div className="calendar-toolbar">
          <div className="calendar-title">{monthLabel}</div>
          <div className="calendar-actions">
            <button className="btn btn-ghost" onClick={() => move(-1)}>
              ← 上月
            </button>
            <button className="btn btn-ghost" onClick={goToday}>
              今天
            </button>
            <button className="btn btn-ghost" onClick={() => move(1)}>
              下月 →
            </button>
          </div>
        </div>
        <div className="calendar-grid week-header">
          {WEEK_HEADERS.map((w) => (
            <div key={w} className="week-cell">
              {w}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {cells.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} className="day-cell empty" />
            const iso = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
            const items = byDate[iso] ?? []
            const isToday = iso === today.toISOString().slice(0, 10)
            const isSelected = iso === selected
            const inMonth = isSameMonth(date, year, month)
            return (
              <button
                key={iso}
                className={[
                  'day-cell',
                  !inMonth ? 'muted' : '',
                  isToday ? 'today' : '',
                  isSelected ? 'selected' : '',
                  items.length > 0 ? 'has-content' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelected(iso === selected ? null : iso)}
              >
                <span className="day-num">{date.getDate()}</span>
                {items.length > 0 && <span className="day-badge">{items.length}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="panel calendar-side">
        <div className="panel-title">{selected ? `${selected} 的内容` : '选择日期查看内容'}</div>
        {selectedItems.length === 0 ? (
          <div className="empty-hint">
            {selected ? '当天暂无内容' : '点击日历中的日期，查看当天的内容安排。'}
          </div>
        ) : (
          <ul className="side-list">
            {selectedItems.map((c) => (
              <li key={c.id} className="side-item">
                <div className="side-item-title">{c.title}</div>
                <div className="side-item-meta">
                  <span className="tag">{c.category}</span>
                  <span className={`status status-${c.status}`}>{STATUS_LABELS[c.status]}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
