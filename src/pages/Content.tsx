import { useMemo, useState, type FormEvent } from 'react'
import { useContent } from '../context/ContentContext'
import { CATEGORIES, STATUS_LABELS, type ContentStatus, type IContent } from '../types'

const PAGE_SIZE = 8

interface FormState {
  title: string
  category: string
  status: ContentStatus
  summary: string
  createdAt: string
}

const emptyForm: FormState = {
  title: '',
  category: CATEGORIES[0],
  status: 'draft',
  summary: '',
  createdAt: new Date().toISOString().slice(0, 10),
}

function ContentDialog({
  mode,
  initial,
  onClose,
}: {
  mode: 'create' | 'edit'
  initial: FormState
  onClose: () => void
}) {
  const { addContent, updateContent } = useContent()
  const [form, setForm] = useState<FormState>(initial)
  const [error, setError] = useState('')

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('标题不能为空')
      return
    }
    if (mode === 'create') {
      addContent({ ...form, title: form.title.trim(), summary: form.summary.trim() || '（暂无摘要）' })
    } else {
      const id = (initial as unknown as { id: number }).id
      updateContent(id, { ...form, title: form.title.trim(), summary: form.summary.trim() || '（暂无摘要）' })
    }
    onClose()
  }

  return (
    <div className="modal-mask" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-title">{mode === 'create' ? '新建内容' : '编辑内容'}</div>
        <form onSubmit={submit} className="modal-form">
          <label className="field">
            <span>标题 *</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="输入内容标题"
            />
          </label>
          <div className="field-row">
            <label className="field">
              <span>分类</span>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>发布日期</span>
              <input
                type="date"
                value={form.createdAt}
                onChange={(e) => set('createdAt', e.target.value)}
              />
            </label>
          </div>
          <div className="field">
            <span>状态</span>
            <div className="radio-row">
              {(Object.keys(STATUS_LABELS) as ContentStatus[]).map((s) => (
                <label key={s} className="radio-item">
                  <input
                    type="radio"
                    name="status"
                    checked={form.status === s}
                    onChange={() => set('status', s)}
                  />
                  {STATUS_LABELS[s]}
                </label>
              ))}
            </div>
          </div>
          <label className="field">
            <span>内容摘要</span>
            <textarea
              rows={3}
              value={form.summary}
              onChange={(e) => set('summary', e.target.value)}
              placeholder="简要描述内容要点"
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Content() {
  const { contents, deleteContent } = useContent()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState<'all' | ContentStatus>('all')
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState<{ mode: 'create'; form: FormState } | { mode: 'edit'; form: FormState & { id: number } } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<IContent | null>(null)

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return contents
      .filter((c) => (keyword ? c.title.toLowerCase().includes(keyword) : true))
      .filter((c) => (category === 'all' ? true : c.category === category))
      .filter((c) => (status === 'all' ? true : c.status === status))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  }, [contents, search, category, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const resetFilters = () => {
    setSearch('')
    setCategory('all')
    setStatus('all')
    setPage(1)
  }

  return (
    <div className="content-page">
      <div className="toolbar">
        <div className="toolbar-filters">
          <input
            type="text"
            className="search-input"
            placeholder="搜索标题…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
          >
            <option value="all">全部分类</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as 'all' | ContentStatus)
              setPage(1)
            }}
          >
            <option value="all">全部状态</option>
            {(Object.keys(STATUS_LABELS) as ContentStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          {(search || category !== 'all' || status !== 'all') && (
            <button className="btn btn-ghost" onClick={resetFilters}>
              重置
            </button>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setDialog({ mode: 'create', form: { ...emptyForm } })}
        >
          + 新建内容
        </button>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>分类</th>
              <th>状态</th>
              <th>发布日期</th>
              <th className="th-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id}>
                <td className="td-title">
                  <div className="td-title-main">{c.title}</div>
                  <div className="td-title-sub">{c.summary}</div>
                </td>
                <td>
                  <span className="tag">{c.category}</span>
                </td>
                <td>
                  <span className={`status status-${c.status}`}>{STATUS_LABELS[c.status]}</span>
                </td>
                <td className="td-date">{c.createdAt}</td>
                <td className="th-actions">
                  <div className="row-actions">
                    <button
                      className="btn btn-small"
                      onClick={() =>
                        setDialog({ mode: 'edit', form: { ...c, id: c.id } })
                      }
                    >
                      编辑
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => setPendingDelete(c)}>
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-cell">
                  没有符合条件的内容
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button
            className="btn btn-ghost"
            disabled={safePage <= 1}
            onClick={() => setPage(safePage - 1)}
          >
            上一页
          </button>
          <span className="page-info">
            {safePage} / {pageCount}（共 {filtered.length} 条）
          </span>
          <button
            className="btn btn-ghost"
            disabled={safePage >= pageCount}
            onClick={() => setPage(safePage + 1)}
          >
            下一页
          </button>
        </div>
      </div>

      {dialog && (
        <ContentDialog
          mode={dialog.mode}
          initial={dialog.form}
          onClose={() => setDialog(null)}
        />
      )}

      {pendingDelete && (
        <div className="modal-mask" onMouseDown={() => setPendingDelete(null)}>
          <div className="modal modal-sm" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-title">确认删除</div>
            <div className="confirm-text">
              确定要删除「{pendingDelete.title}」吗？此操作不可撤销。
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setPendingDelete(null)}>
                取消
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteContent(pendingDelete.id)
                  setPendingDelete(null)
                }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
