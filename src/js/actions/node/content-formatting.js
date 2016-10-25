import * as markdown from 'markdown-it'
const md = markdown.default()
            .set({ linkify: true })

export const RENDER_MARKDOWN = 'RENDER_MARKDOWN'

export const renderMarkdown = (content, inline = true) => {
  let renderedContent;
  if(!content || !content.trim()){
    renderedContent = '';
  } else if(inline){
    renderedContent = md.renderInline(content)
  } else {
    renderedContent = md.render(content)
  }

  return {
    type: RENDER_MARKDOWN,
    payload: renderedContent
  }
}
