import React from 'react'
import { CompositeDecorator } from 'draft-js'
import { store } from '../../redux/configure-store'

export const createHighlightDecorator = () => (
  new CompositeDecorator([
  {
    strategy: findText,
    component: highlightSpan
  }
]))

function findText (contentBlock, callback) {
  const phrase = store.getState().search.get('currentlySearchingOn')

  if (phrase && phrase !== '' && !phrase.startsWith('#')) {
    const text = contentBlock.getText()
    const findTextToHighlightRegex = new RegExp(phrase, 'gi')
    let matchArr, start
    while ((matchArr = findTextToHighlightRegex.exec(text)) !== null) {
      start = matchArr.index
      callback(start, start + matchArr[0].length)
    }
  }
}

const highlightSpan = (props) => {
  return <span className='highlight' >{props.children}</span>
}
