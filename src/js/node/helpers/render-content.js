import * as markdown from 'markdown-it'
const md = markdown.default()
            .set({ linkify: true })

const renderContent = (content) => {
  let renderedContent
  if (!content || !content.trim()) {
    renderedContent = ''
  } else {
    renderedContent = md.renderInline(content)
    renderedContent = renderedContent.replace('{{{', '<span class="tag">').replace('}}}', '</span>')
  }

  return {
    payload: renderedContent
  }
}

export default renderContent
