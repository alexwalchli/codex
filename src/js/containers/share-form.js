import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { dictionaryToArray } from '../utilities/tree-queries';
import { WithContext as ReactTags } from 'react-tag-input';

export class ShareForm extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            tags: [ {id: 1, text: "Apples"} ],
            suggestions: ["Banana", "Mango", "Pear", "Apricot"]
        };
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

    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }

    handleAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    }

    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;
 
        // mutate array 
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
 
        // re-render 
        this.setState({ tags: tags });
    }

    render() {
        const { tags, suggestions } = this.state;
        const { onShareCancel, userPage } = this.props;

        return (
            <form className="share-form" >
                <h5>Share {userPage.title} with others</h5>
                <div>
                    <ReactTags tags={tags}
                        suggestions={suggestions}
                        handleDelete={() => this.handleDelete()}
                        handleAddition={() => this.handleAddition()}
                        handleDrag={() => this.handleDrag()}
                        placeholder='Add someone by email' />
                </div>

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