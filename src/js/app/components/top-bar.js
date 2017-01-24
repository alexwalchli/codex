import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../app-action-creators'
import SearchInput from '../../search/components/search-input'
// import ShareForm from '../containers/share-form'
import TopBarDropdown from './top-bar-dropdown'

var colours = [{
  name: 'Red',
  hex: '#F21B1B'
}, {
  name: 'Blue',
  hex: '#1B66F2'
}, {
  name: 'Green',
  hex: '#07BA16'
}]

export class Topbar extends Component {

  render () {
    return (
      <nav className='top-bar clearfix'>
        <div className='top-bar-left'>
          <ul>
            <li><SearchInput /></li>
          </ul>
        </div>
        <div className='top-bar-right'>
          <ul className='menu'>
            <li><a><i className='icon dripicons-archive' /></a></li>
            <li>
              <TopBarDropdown iconCss='icon dripicons-gear' list={colours} selected={colours[0]}>
                <div className='item'>
                  <h4>Type Scale</h4>
                </div>
                <div className='item'>
                  <h4>Theme</h4>
                </div>
              </TopBarDropdown>
            </li>
            <li><a><i className='icon dripicons-user' /></a></li>
          </ul>
        </div>
      </nav>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return ownProps
}

const ConnectedTopbar = connect(mapStateToProps, actions)(Topbar)
export default ConnectedTopbar

// <li><span className='logo'>codex</span></li>
// <li>
//   <a onClick={toggleShareDropdown}><i className='icon dripicons-user-group' /></a>
//   { app.shareDropdownVisible
//     ? <div className='dropdown'>
//       <div className='dropdown-content'>
//         <ShareForm onShareCancel={toggleShareDropdown} userPageId={currentUserPage.id} />
//       </div>
//     </div>
//     : null }
// </li>
