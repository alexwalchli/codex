import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as appActionCreators from '../app-action-creators'
import * as userPreferencesActionCreators from '../../user-preferences/user-preferences-action-creators'
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

  onTypeScaleClick (e, typeScale) {
    e.stopPropagation()
    const { updateTypeScale } = this.props
    updateTypeScale(typeScale)
  }

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
                  <a onClick={(e) => this.onTypeScaleClick(e, 1.25)}>1.25</a>
                  <a onClick={(e) => this.onTypeScaleClick(e, 1.00)}>1.00</a>
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

const ConnectedTopbar = connect(
  mapStateToProps,
  { ...appActionCreators, ...userPreferencesActionCreators }
)(Topbar)
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
