import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { dictionaryToArray } from '../utilities/tree-queries'
import ShareForm from '../containers/share-form'

export class PagesSidePanel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentlyEditingPageNameId: null
    }
  }

  setHeight () {
    this.refs.sidePanel.style.height = (window.innerHeight - 71) + 'px'
  }

  componentDidMount () {
    this.setHeight()
    window.addEventListener('resize', this.setHeight.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setHeight.bind(this))
  }

  onDeleteClicked (e, userPageId) {
    e.stopPropagation()

    const { deleteUserPage } = this.props
    deleteUserPage(userPageId)
  }

  onEditPageNameClicked (e, userPageId) {
    e.stopPropagation()

    this.editPageName(userPageId)
  }

  onCancelEditPageNameClicked (e, userPageId) {
    e.stopPropagation()
    this.setState({ currentlyEditingPageNameId: null })
  }

  onSavePageNameClicked (e, userPageId) {
    e.stopPropagation()
    this.submitUpdatedUserPageName(userPageId)
  }

  onKeyDownEditPageName (e, userPageId) {
    e.stopPropagation()

    if (e.key === 'Enter') {
      this.submitUpdatedUserPageName(userPageId)
    }
  }

  onClickCreateNewUserPage () {
    const { createUserPage } = this.props
    createUserPage()
  }

  editPageName (userPageId) {
    this.setState({ currentlyEditingPageNameId: userPageId })
  }

  submitUpdatedUserPageName (userPageId) {
    const { updateUserPageName } = this.props
    let newPageName = this.refs['page-name-' + userPageId].value
    updateUserPageName(userPageId, newPageName)
    this.editPageName(null)
  }

  onPageClick (e, userPageId) {
    const { navigateToUserPage } = this.props
    const { currentlyEditingPageNameId, currentlySharingPageId } = this.state

    if (userPageId === currentlyEditingPageNameId || userPageId === currentlySharingPageId) {
      return
    }

    navigateToUserPage(userPageId)
  }

  render () {
    const { currentlyEditingPageNameId, currentlySharingPageId } = this.state

    return (
      <div ref='sidePanel' className='pages-side-panel'>
        <div className='pages'>
          {dictionaryToArray(this.props.userPages).map((item) => {
            return <div onClick={(e) => this.onPageClick(e, item.id)} key={item.id} className='page'>

              { item.id === currentlySharingPageId
                ? <ShareForm userPageId={item.id} onShareCancel={(e, id) => this.onShareCancel(e, id)} onShareSubmit={(e, id, emails) => this.onShareSubmit(e, id, emails)} />
                : <div>
                  { item.id === currentlyEditingPageNameId
                      ? <div>
                        <input onClick={(e) => this.onEditPageNameClicked(e)} onKeyDown={(e) => this.onKeyDownEditPageName(e, item.id)} autoFocus className='title' type='text' defaultValue={item.title} ref={'page-name-' + item.id} />
                        <div onClick={(e) => this.onCancelEditPageNameClicked(e, item.id)} className='button edit-name icon dripicons-wrong' />
                        <div onClick={(e) => this.onSavePageNameClicked(e, item.id)} className='button delete icon dripicons-return' />
                      </div>
                        : <div>
                          <div className='title'>{item.title}</div>
                          <div onClick={(e) => this.onEditPageNameClicked(e, item.id)} className='button edit-name icon dripicons-pencil' />
                          <div onClick={(e) => this.onDeleteClicked(e, item.id)} className='button delete icon dripicons-cross' />
                        </div>
                    }
                </div>
                }
            </div>
          })}
          <div onClick={() => this.onClickCreateNewUserPage()} className='page'>
            <div className='title'><i className='icon dripicons-plus' aria-hidden='true' />&nbsp;&nbsp;Add new Page</div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return { userPages: state.userPages, ...ownProps }
}

const ConnectedPagesSidePanel = connect(mapStateToProps, actions)(PagesSidePanel)
export default ConnectedPagesSidePanel
