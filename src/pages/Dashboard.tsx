import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useContent } from '../context/ContentContext'
import { CATEGORIES, STATUS_LABELS, type ContentStatus } from '../types'

const CATEGORY_COLORS = ['#2563eb', '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981']

function formatMonth(iso: string): string {
  return iso.slice(0, 7)
}

export default function Dashboard() {
  const { contents, loading } = useContent()

  const kpis = useMemo(() => {
    const total = contents.length
    const byStatus = (s: ContentStatus) => contents.filter((c) => c.status === s).length
    const published = byStatus('published')
    const draft = byStatus('draft')
    const archived = byStatus('archived')
    const ratio = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100))
    return [
      { label: '内容总数', value: total, hint: '全部内容', accent: '#2563eb' },
      { label: '已发布', value: published, hint: `${ratio(published)}% 占比`, accent: '#16a34a' },
      { label: '草稿', value: draft, hint: `${ratio(draft)}% 占比`, accent: '#d97706' },
      { label: '已归档', value: archived, hint: `${ratio(archived)}% 占比`, accent: '#6b7280' },
    ]
  }, [contents])

  const trendData = useMemo(() => {
    const months: Record<string, number> = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date('2026-10-01T00:00:00')
      d.setMonth(d.getMonth() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months[key] = 0
    }
    contents.forEach((c) => {
      if (c.status === 'published' && months[formatMonth(c.createdAt)] !== undefined) {
        months[formatMonth(c.createdAt)] += 1
      }
    })
    return Object.entries(months).map(([month, count]) => ({
      month: month.slice(2),
      count,
    }))
  }, [contents])

  const categoryData = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      name: cat,
      value: contents.filter((c) => c.category === cat).length,
    })).filter((d) => d.value > 0)
  }, [contents])

  const latest = useMemo(
    () => [...contents].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5),
    [contents],
  )

  if (loading) {
    return <div className="page-loading">正在加载数据…</div>
  }

  return (
    <div className="dashboard">
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.accent }}>
              {k.value}
            </div>
            <div className="kpi-hint">{k.hint}</div>
          </div>
        ))}
      </div>

      <div className="chart-grid">
        <div className="panel">
          <div className="panel-title">发布趋势（近 6 个月）</div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="发布数"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">分类占比</div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={86}
                  paddingAngle={3}
                  label={(entry) => `${entry.name} ${entry.value}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          最新内容
          <Link to="/content" className="panel-link">
            查看全部 →
          </Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>分类</th>
              <th>状态</th>
              <th>发布日期</th>
            </tr>
          </thead>
          <tbody>
            {latest.map((c) => (
              <tr key={c.id}>
                <td className="td-title">{c.title}</td>
                <td>
                  <span className="tag">{c.category}</span>
                </td>
                <td>
                  <span className={`status status-${c.status}`}>{STATUS_LABELS[c.status]}</span>
                </td>
                <td className="td-date">{c.createdAt}</td>
              </tr>
            ))}
            {latest.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-cell">
                  暂无内容
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
