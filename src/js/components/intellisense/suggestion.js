import React, { Component } from 'react'

export default class Suggestion extends Component {

  render () {
    const { label, selected } = this.props

    const cssClasses = 'suggestion ' + (selected ? 'selected' : null)

    return (
      <li className={cssClasses}>{label}</li>
    )
  }

}
