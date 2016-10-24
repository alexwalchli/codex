import * as markdown from 'markdown-it'
const md = markdown.default()

export const RENDER_MARKDOWN = 'RENDER_MARKDOWN'

export const renderMarkdown = (content) => ({
  type: RENDER_MARKDOWN,
  payload: md.renderInline(content)
})
