import * as markdown from 'markdown-it'
const md = markdown.default()
            .set({ linkify: true })

export const RENDER_CONTENT = 'RENDER_CONTENT'

export const renderContent = (content) => {
  let renderedContent
  if (!content || !content.trim()) {
    renderedContent = ''
  } else {
    renderedContent = md.renderInline(content)
    renderedContent = renderedContent.replace('{{{', '<span class="tag">').replace('}}}', '</span>')
  }

  return {
    type: RENDER_CONTENT,
    payload: renderedContent
  }
}
