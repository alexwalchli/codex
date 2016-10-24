import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions/node'

export class BulletReadContentView extends Component {

  constructor (props) {
    super(props)

    this.state = {
      renderedContent: ''
    }
  }

  componentWillMount () {
    const { content, renderMarkdown } = this.props
    this.setState({
      renderedContent: renderMarkdown(content).payload
    })
  }

  componentWillReceiveProps (newProps) {
    const { renderMarkdown } = this.props
    if (newProps.content !== this.props.content) {
      this.setState({
        renderedContent: renderMarkdown(newProps.content).payload
      })
    }
  }

  getHtmlContent () {
    return { __html: this.state.renderedContent }
  }

  render () {
    return (
      <div className='view-mode-content' dangerouslySetInnerHTML={this.getHtmlContent()} />
    )
  }
}

// react redux

const mapStateToProps = (state, ownProps) => {
  return state.tree.present[ownProps.nodeId]
}

const ConnectedBulletReadContentView = connect(mapStateToProps, actions)(BulletReadContentView)
export default ConnectedBulletReadContentView
