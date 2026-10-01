import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import { ContentProvider } from './context/ContentContext'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Content from './pages/Content'
import './index.css'

const NAV_ITEMS = [
  { to: '/', label: '数据看板', icon: '📊' },
  { to: '/calendar', label: '日历视图', icon: '📅' },
  { to: '/content', label: '内容管理', icon: '🗂️' },
]

function App() {
  return (
    <ContentProvider>
      <HashRouter>
        <div className="app-shell">
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-logo">CW</div>
              <div className="brand-name">Content Workbench</div>
            </div>
            <nav className="nav">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="sidebar-foot">React + TS · REST API</div>
          </aside>
          <div className="main">
            <header className="topbar">
              <div className="topbar-title">内容管理工作台</div>
              <div className="topbar-date">
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </div>
            </header>
            <main className="content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/content" element={<Content />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </ContentProvider>
  )
}

export default App
