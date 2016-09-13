import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { dictionaryToArray } from '../utilities/tree-queries';

export class ShareForm extends Component {
    constructor(props) {
        super(props);
    }

    onSubmit(e){
        const { onShareSubmit, userPage } = this.props;
        let emails = this.refs.emails.value;
        onShareSubmit(e, userPage.id, emails);
    }

    onCancel(e){
        const { onShareCancel, userPage } = this.props;
        onShareCancel(e, userPage.id);
    }

    render() {
        const { onShareCancel, userPage } = this.props;

        return (
            <form className="share-form" >
                <h2>{userPage.title}</h2>
                <label>Add users by email:</label>
                <div>
                    <input ref="emails" type="text" />
                </div>

                <p><i>Not currently shared with anyone</i></p>

                <a className="btn" disabled="disabled" onClick={(e) => this.onSubmit(e)}>Share</a>
                <a className="btn secondary-btn" onClick={(e) => this.onCancel(e)}>Cancel</a>
            </form>
        )
    }
}

function mapStateToProps(state, ownProps) {
    let userPage = state.userPages[ownProps.userPageId];
    return { userPage, ...ownProps };
}

const ConnectedShareForm = connect(mapStateToProps, actions)(ShareForm)
export default ConnectedShareForm