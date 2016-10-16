import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/node';

export class AppContextMenu extends Component {
    constructor(props) {
        super(props);
    }

    onDeleteClick(e){
        const { deleteNodes, tree } = this.props;
        e.stopPropagation();
        deleteNodes(nodeList(tree.present).filter(item => item.selected).map(node => node.id));
    }

    onCompleteClick(e){
        const { completeNodes, tree } = this.props;
        e.stopPropagation();
        completeNodes(nodeList(tree.present).filter(item => item.selected).map(node => node.id));
    }

    render() {
        const { tree } = this.props;
        var itemsSelected = nodeList(tree.present).filter(item => item.selected);
        var cssClasses = '';
        if(!itemsSelected.length){
            cssClasses = 'hidden';
        }

        return (
            <div id="app-context-menu" className={cssClasses}>
                <button onClick={(e) => this.onDeleteClick(e)}>Delete</button> or <button onClick={(e) => this.onCompleteClick(e)}>Complete</button> {itemsSelected.length} items
            </div>
        )
    }
}

function nodeList(nodes){
    var nodeList = Object.keys(nodes).map(nodeId => nodes[nodeId]);

    return nodeList;
}

function mapStateToProps(state, ownProps) {
    return {...state, ...ownProps };
}

const ConnectedAppContextMenu = connect(mapStateToProps, actions)(AppContextMenu)
export default ConnectedAppContextMenu