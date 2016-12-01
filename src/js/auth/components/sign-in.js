import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as authActionCreators from '../actions/auth-action-creators'

export class SignIn extends Component {

  render () {
    const { signInWithGithub, signInWithGoogle, signInWithTwitter } = this.props

    return (
      <div className='g-row sign-in'>
        <div className='g-col'>
          <div className='sign-in-logo'>codex</div>
          <a className='btn-sign-in btn-google' onClick={signInWithGoogle}>
            <span className='fa fa-google' />
                    Sign in with Google
          </a>
          <a className='btn-sign-in btn-twitter' onClick={signInWithTwitter}>
            <span className='fa fa-twitter' />
                    Sign in with Twitter
          </a>
          <a className='btn-sign-in btn-github' onClick={signInWithGithub}>
            <span className='fa fa-github' />
                    Sign in with GitHub
          </a>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return state
}

const ConnectedSignIn = connect(mapStateToProps, authActionCreators)(SignIn)
export default ConnectedSignIn
