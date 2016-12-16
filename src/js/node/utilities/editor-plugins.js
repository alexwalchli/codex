import React from 'react'
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import createEmojiPlugin from 'draft-js-emoji-plugin'
import createMentionPlugin from 'draft-js-mention-plugin'

const hashTagConfig = { theme: { hashtag: 'hashtag' } }
const linkifyConfig = {
  component: (props) => (
    <a {...props} className='editor-link' onClick={(e) => {
      var link = e.target.innerText
      if (link.includes('http://') || link.includes('http://')) {
        window.open(e.target.innerText)
      } else {
        window.open(`https://${e.target.innerText}`)
      }
    }} />
  )
}

export const mentionPlugin = createMentionPlugin()
export const emojiPlugin = createEmojiPlugin()
export const hashtagPlugin = createHashtagPlugin(hashTagConfig)
export const linkifyPlugin = createLinkifyPlugin(linkifyConfig)
export const allPlugins = [
  mentionPlugin,
  hashtagPlugin,
  linkifyPlugin,
  emojiPlugin
]
export const { MentionSuggestions } = mentionPlugin
export const { EmojiSuggestions } = emojiPlugin
