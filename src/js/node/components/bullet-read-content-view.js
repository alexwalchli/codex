import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions/node-action-creators'
import renderContent from '../helpers/render-content'

export class BulletReadContentView extends Component {

  constructor (props) {
    super(props)

    this.state = {
      renderedContent: ''
    }
  }

  componentWillMount () {
    const { content } = this.props
    this.setState({
      renderedContent: renderContent(content).payload
    })
  }

  componentWillReceiveProps (newProps) {
    const { renderedContent } = this.props
    if (newProps.content !== this.props.content) {
      this.setState({
        renderedContent: renderedContent(newProps.content).payload
      })
    }
  }

  getHtmlContent () {
    return { __html: this.state.renderedContent }
  }

  render () {
    return (
      <div className='rendered-content' dangerouslySetInnerHTML={this.getHtmlContent()} />
    )
  }
}

// react redux

const mapStateToProps = (state, ownProps) => {
  return state.tree.present[ownProps.nodeId]
}

const ConnectedBulletReadContentView = connect(mapStateToProps, actionCreators)(BulletReadContentView)
export default ConnectedBulletReadContentView

