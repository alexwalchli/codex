import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { dictionaryToArray } from '../utilities/tree-queries';

export class PagesSidePanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentlyEditingPageNameId: null
        };
    }

    onDeleteClicked(e, userPageId){
        e.stopPropagation();

        const { deleteUserPage } = this.props;
        deleteUserPage(userPageId);
    }

    onEditPageNameClicked(e, userPageId){
        e.stopPropagation();

        this.editPageName(userPageId);
    }

    onShareUserPageClicked(e, userPageId){
        e.stopPropagation();
        const { openShareUserPageDialog } = this.props;

        openShareUserPageDialog(userPageId);
    }

    onCancelEditPageNameClicked(e, userPageId){
        e.stopPropagation();
        this.setState({ currentlyEditingPageNameId : null });
    }

    onSavePageNameClicked(e, userPageId){
        e.stopPropagation();
        this.submitUpdatedUserPageName(userPageId);
    }

    onKeyDownEditPageName(e, userPageId){
        e.stopPropagation();

        if (e.key === 'Enter'){
            this.submitUpdatedUserPageName(userPageId);
        }
    }

    onClickCreateNewUserPage(){
        const { createNewUserPage } = this.props;
        createNewUserPage();
    }

    editPageName(userPageId){
        this.setState({ currentlyEditingPageNameId : userPageId });
    }

    submitUpdatedUserPageName(userPageId){
        const { updateUserPageName } = this.props;
        let newPageName = this.refs['page-name-' + userPageId].value;
        updateUserPageName(userPageId, newPageName); 
        this.editPageName(null);
    }

    render() {
        const { createNewUserPage, navigateToUserPage, deleteUserPage } = this.props;
        const { currentlyEditingPageNameId } = this.state;
        
        return (
           <div className="pages-side-panel">
                <div className="pages">
                    {dictionaryToArray(this.props.userPages).map((item) => {
                        return <div onClick={() => navigateToUserPage(item.id)} key={item.id} className="page">
                                    { item.id === currentlyEditingPageNameId ? 
                                        <div>
                                            <input onClick={(e) => this.onEditPageNameClicked(e)} onKeyDown={(e) => this.onKeyDownEditPageName(e, item.id)} autoFocus={true} className="title" type="text" defaultValue={item.title} ref={'page-name-' + item.id} />
                                            <div onClick={(e) => this.onCancelEditPageNameClicked(e, item.id)} className="button edit-name icon dripicons-wrong"></div>
                                            <div onClick={(e) => this.onSavePageNameClicked(e, item.id)} className="button delete icon dripicons-return"></div>
                                        </div>
                                    : 
                                        <div>
                                            <div className="title">{item.title}</div>
                                            <div onClick={(e) => this.onEditPageNameClicked(e, item.id)} className="button edit-name icon dripicons-pencil"></div>
                                            <div onClick={(e) => this.onDeleteClicked(e, item.id)} className="button delete icon dripicons-cross"></div>
                                            <div onClick={(e) => this.onShareUserPageClicked(e, item.id)} className="button share icon dripicons-user-group"></div>
                                        </div>
                                    }
                                </div>
                    })}
                    <div onClick={() => this.onClickCreateNewUserPage()} className="page">
                        <div className="title"><i className="icon dripicons-plus" aria-hidden="true"></i>&nbsp;&nbsp;Add new Page</div>
                    </div>
                </div>
           </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return { userPages : state.userPages, ...ownProps };
}

const ConnectedPagesSidePanel = connect(mapStateToProps, actions)(PagesSidePanel)
export default ConnectedPagesSidePanel