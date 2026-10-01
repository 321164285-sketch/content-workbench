import type { ContentStatus, IContent } from '../types'
import { CATEGORIES } from '../types'

const API_BASE = 'https://jsonplaceholder.typicode.com'

interface ApiPost {
  id: number
  userId: number
  title: string
  body: string
}

const STATUS_POOL: ContentStatus[] = ['published', 'published', 'draft', 'archived']

function dateForIndex(index: number, total: number): string {
  // Spread dates across the last 6 months so the dashboard / calendar look alive.
  const base = new Date('2026-10-01T00:00:00')
  const dayOffset = total - index
  base.setDate(base.getDate() - dayOffset)
  return base.toISOString().slice(0, 10)
}

function mapApiPost(post: ApiPost, index: number): IContent {
  return {
    id: post.id,
    title: post.title.charAt(0).toUpperCase() + post.title.slice(1),
    category: CATEGORIES[index % CATEGORIES.length],
    status: STATUS_POOL[index % STATUS_POOL.length],
    summary: post.body.replace(/\n+/g, ' ').slice(0, 140) + '…',
    createdAt: dateForIndex(index, 60),
  }
}

/**
 * Seed data used when the remote REST API is unreachable (offline demo / preview).
 */
export const SEED_CONTENTS: IContent[] = [
  { id: 1, title: 'AI 内容生成器：产品发布路线图', category: 'Tech', status: 'published', summary: '我们如何从概念走向可用的 MVP，以及接下来三个季度的功能规划。', createdAt: '2026-09-28' },
  { id: 2, title: 'Q3 内容营销复盘：数据驱动增长', category: 'Marketing', status: 'published', summary: '回顾第三季度各渠道的内容表现，总结转化率最高的内容类型与发布时机。', createdAt: '2026-09-25' },
  { id: 3, title: '设计系统 v2：组件规范更新', category: 'Design', status: 'published', summary: '重新梳理颜色、间距与组件状态，让多端产品体验保持一致。', createdAt: '2026-09-22' },
  { id: 4, title: 'B2B 销售方法论：从线索到成交', category: 'Business', status: 'draft', summary: '沉淀一套可复制的销售流程，配合 CRM 与内容资产提升转化。', createdAt: '2026-09-18' },
  { id: 5, title: '秋季旅行灵感：欧洲小众目的地', category: 'Lifestyle', status: 'published', summary: '避开人潮的欧洲小镇清单，附行程建议与预算参考。', createdAt: '2026-09-15' },
  { id: 6, title: 'React 状态管理实践：Context + Reducer', category: 'Tech', status: 'published', summary: '在中小型应用中用 Context 与 useReducer 替代重量级状态库的实战经验。', createdAt: '2026-09-12' },
  { id: 7, title: '品牌焕新：视觉语言重塑', category: 'Design', status: 'draft', summary: '从 logo 到插画风格的全面升级，以及新旧视觉切换的过渡方案。', createdAt: '2026-09-08' },
  { id: 8, title: '短视频带货脚本模板 v3', category: 'Marketing', status: 'published', summary: '面向直播与短视频场景的脚本框架，覆盖开场、痛点、卖点与促单。', createdAt: '2026-09-05' },
  { id: 9, title: '数据中台建设：一期复盘', category: 'Business', status: 'archived', summary: '一期数据中台已交付，本文记录技术选型、踩坑与后续迭代方向。', createdAt: '2026-08-30' },
  { id: 10, title: '远程办公效率工具盘点', category: 'Lifestyle', status: 'published', summary: '协作、文档、会议与时间管理的工具组合推荐。', createdAt: '2026-08-26' },
  { id: 11, title: 'Web 性能优化：从 Lighthouse 到实战', category: 'Tech', status: 'published', summary: '首屏加载优化、资源拆包与图片懒加载的具体收益数据。', createdAt: '2026-08-21' },
  { id: 12, title: '用户访谈方法论：10 个关键提问', category: 'Design', status: 'draft', summary: '如何在访谈中挖掘真实需求，避免引导性问题。', createdAt: '2026-08-16' },
  { id: 13, title: '私域运营手册：社群冷启动', category: 'Marketing', status: 'published', summary: '从 0 到 1000 人的社群冷启动步骤与常见坑。', createdAt: '2026-08-11' },
  { id: 14, title: '季度经营分析：收入结构拆解', category: 'Business', status: 'published', summary: '分业务线的收入、毛利与增速分析，以及资源倾斜建议。', createdAt: '2026-08-05' },
  { id: 15, title: '夏季护肤清单：油皮友好', category: 'Lifestyle', status: 'archived', summary: '适合油性皮肤的夏季护肤品推荐与使用顺序。', createdAt: '2026-07-30' },
  { id: 16, title: 'REST API 设计规范', category: 'Tech', status: 'draft', summary: '资源命名、状态码与版本管理的最佳实践。', createdAt: '2026-07-25' },
  { id: 17, title: '品牌内容日历：十月规划', category: 'Marketing', status: 'published', summary: '十月各渠道内容排期、节点主题与分工安排。', createdAt: '2026-07-20' },
  { id: 18, title: '城市徒步路线：老城漫步', category: 'Lifestyle', status: 'published', summary: '三条步行友好的城市路线，串联老街、咖啡馆与博物馆。', createdAt: '2026-07-14' },
  { id: 19, title: 'A/B 测试实战：着陆页优化', category: 'Marketing', status: 'published', summary: '通过 A/B 测试将注册转化率提升 23% 的完整过程。', createdAt: '2026-07-08' },
  { id: 20, title: 'OKR 落地指南：团队实践', category: 'Business', status: 'archived', summary: '目标对齐、关键结果拆解与周度复盘机制。', createdAt: '2026-07-02' },
  { id: 21, title: '深色模式设计要点', category: 'Design', status: 'draft', summary: '对比度、语义色与组件状态在深色模式下的处理。', createdAt: '2026-06-28' },
  { id: 22, title: 'Python 数据分析入门路线', category: 'Tech', status: 'published', summary: '从 Pandas 到可视化的一站式学习路径与练手项目。', createdAt: '2026-06-22' },
  { id: 23, title: '夏日减脂餐：一周食谱', category: 'Lifestyle', status: 'published', summary: '高蛋白低卡的一周搭配，附热量参考。', createdAt: '2026-06-16' },
  { id: 24, title: '数据可视化选型指南', category: 'Tech', status: 'published', summary: '不同场景下图表类型的选择逻辑与常见误区。', createdAt: '2026-06-10' },
]

/**
 * Fetch contents from the public REST API (JSONPlaceholder).
 * Falls back to seed data when the network is unavailable so the demo never breaks.
 */
export async function fetchContents(): Promise<IContent[]> {
  try {
    const res = await fetch(`${API_BASE}/posts`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const posts = (await res.json()) as ApiPost[]
    return posts.slice(0, 60).map(mapApiPost)
  } catch {
    return SEED_CONTENTS
  }
}
