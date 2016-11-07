import React, { Component } from 'react'

export default class AppLoader extends Component {
  render () {
    return (
      <div className='app-loader'>
        <div className='spinner-container'><i className='icon dripicons-loading spinner' /></div>&nbsp;&nbsp;Loading...
      </div>
    )
  }
}
