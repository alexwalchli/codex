import React, { Component } from 'react'
// import { embededCode } from '../widgets'

export default class BulletReadContentView extends Component {
  getFinalBulletContent (finalContent) {
    return { __html: finalContent }
  }

  render () {
    const { content } = this.props
    //const finalContent = embededCode.parseAndRender(content)

    return (
      <div className='view-mode-content' dangerouslySetInnerHTML={this.getFinalBulletContent(content)} />
    )
  }
}
