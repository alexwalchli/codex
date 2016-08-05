import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/node';
import Endpoints from "../endpoints";
import _ from "lodash";
import urlWidget from '../widgets/url-widget';
import { MentionsInput, Mention } from "../components/intellisense";
import defaultStyle from "./mentionStyle";
import defaultMentionStyle from "./defaultMentionStyle";

export class Node extends Component {
    constructor(props) {
        super(props);
        this.handleAddChildClick = this.handleAddChildClick.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnToggleExpansionClick = this.handleOnToggleExpansionClick.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this);
        this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this);
        this.renderChild = this.renderChild.bind(this);
        //this.componentDidMount = this.componentDidMount.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.debouncedUpdateNodeWidgetDataIfNecessary = _.debounce(this.debouncedUpdateNodeWidgetDataIfNecessary.bind(this),1000);

        this.state = { 
            tags: [],
            content: props.content
        };
    }

    componentWillReceiveProps(newProps){
        this.setState({ 
            externalData: newProps.externalData,
            content: newProps.content
        });
    }

    handleChange(e, value) {
        // const {id, updateContent, updateNodeWidgetDataIfNecessary } = this.props;
        this.setState({
            content: value
        });

        // this.debouncedUpdateNodeWidgetDataIfNecessary(id, value);
    }

    debouncedUpdateNodeWidgetDataIfNecessary(id, value){
        // const { updateNodeWidgetDataIfNecessary } = this.props;
        
        // updateNodeWidgetDataIfNecessary(id, value);
    }

    handleOnBlur(e){
       this.submitContent();
        // const { id, content, morphNodeContent } = this.props;

        // if(content){
        //     morphNodeContent(id, content);
        // }
    }

    handleOnToggleExpansionClick(){
        const { id, toggleNodeExpansion, focusNode } = this.props;
        toggleNodeExpansion(id);
        focusNode(id);
    }

    handleOnMouseEnter(e){
        this.selectNodeIfHoldingMouseDown(e);
    }

    handleOnMouseLeave(e){
        this.selectNodeIfHoldingMouseDown(e);
    }

    handleOnKeyDown(e){
        const { addChild, createNode, childIds, deleteNode, focusNodeAbove, undo, redo,
                focusNodeBelow, focusNode, parentId, id, demoteNode, promoteNode, updateContent } = this.props;
        e.stopPropagation();

        if(e.key === 'Tab' && e.shiftKey){
            e.preventDefault();
            this.submitContent();
            promoteNode(id, parentId);
        } 
        else if(e.key === 'Tab'){
            e.preventDefault();
            this.submitContent();
            demoteNode(id, parentId);
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            this.submitContent();
            // if cursor is add the beginning of the input, add new node at current position, else below
            const fromSilbingOffset = e.target.selectionEnd === 0 && e.target.value ? 0 : 1;
            const newSiblingId = createNode(id, fromSilbingOffset, parentId).nodeId;
            addChild(childIds.length === 0 ? parentId : id, newSiblingId, id, fromSilbingOffset);

            // keep focused on the current node if we add the new node above it
            if(fromSilbingOffset > 0){
                focusNode(newSiblingId);
            }
        }
        else if(e.key === 'Backspace' && !this.props.content){
            if(!this.state.content){
                e.preventDefault();
                focusNodeAbove(id);
                deleteNode(id, parentId);
            }
        }
        else if(e.key === 'ArrowDown'){
            e.preventDefault();
            this.submitContent();
            focusNodeBelow(id);
        }
        else if(e.key === 'ArrowUp'){
            e.preventDefault();
            this.submitContent();
            focusNodeAbove(id);
        }
        else if(e.key === 'v' && (e.metaKey || e.cntrlKey)){
            // if there are bullets from within the app copied, then paste those and prevent further actions
            // else do nothing
        }
        else if(e.key === 'c' && (e.metaKey || e.cntrlKey)){
            // determine what nodes are selected, and copy them to a clipboardData
        }
        else if(e.key === 'z' && e.shiftKey && (e.metaKey || e.cntrlKey)){
            redo();
        }
        else if(e.key === 'z' && (e.metaKey || e.cntrlKey)){
            undo();
        }
    }

    handleOnClick(e){
        const { id, focusNode, selectNode } = this.props;

        if(e.ctrlKey || e.metaKey){
            selectNode(id);
        }else{
            focusNode(id);
        }
    }

    handleAddChildClick(e) {
        e.preventDefault();

        const { addChild, createNode, id } = this.props;
        const childId = createNode(id, 1, id).nodeId;
        addChild(id, childId);
    }

    handlePaste(e) {
        const { parentId, id, createNode, addChild, focusNode } = this.props;

        var pastedText = e.clipboardData.getData('Text');
        if(pastedText.indexOf('\n') > -1){
            pastedText = pastedText.replace(/\d\.\s+|[a-z]\)\s+|•\s+|[A-Z]\.\s+|[IVX]+\.\s+/g, ""); // remove bullets
            e.preventDefault(); // prevent the pasted text from being pasted into the current node
            _.reverse(e.clipboardData.getData('Text').split('\n')).forEach(s => {
                s = s.trim();
                // remove initial dashes
                if(s[0] === '-'){
                    s = s.slice(1, s.length);
                }
                var newSiblingId = createNode(id, 1, parentId, s).nodeId;
                addChild(parentId, newSiblingId, id);
                focusNode(newSiblingId);
            });
        }
    }

    onSelect(e){
        const { focusNode } = this.props;
        ///focusNode(this.props.id);
    }

    onAdd(suggestionId, suggestionDisplay){
        const { fetchDataIfNeeded, id } = this.props;
        fetchDataIfNeeded(id, suggestionId, 'all');
    }

    onRemove(suggestionId, suggestionDisplay){
        alert(suggestionId);
    }

    renderChild(childId) {
        const { id } = this.props;
        return (
            <div key={childId}>
                <ConnectedNode id={childId} parentId={id} />
            </div>
        )
    }

    selectNodeIfHoldingMouseDown(e){
        const { selectNode, id } = this.props;
        if(e.nativeEvent.which === 1 && !this.props.selected && this.props.id !== "0"){
            selectNode(id);
            e.stopPropagation();
        }
    }

    getFinalNodeContent(finalContent){
        return { __html: finalContent };
    }

    renderNodeWidgets(){
        const { content, widgets, widgetDataUpdating } = this.props;

        if(widgets.length && !widgetDataUpdating){
            var finalContent = content;
            widgets.forEach((widgetData) => {
                // TODO: allow other widgets
                finalContent = finalContent.replace(widgetData.matchingText, urlWidget.render(widgetData));
            });

            return (
                <div className="view-mode-content" dangerouslySetInnerHTML={this.getFinalNodeContent(finalContent)}></div>
            );
        } else {
            return (<div className="view-mode-content">{content}</div>);
        }   
    }

    submitContent(){
        const { id, content, updateContent, updateNodeWidgetDataIfNecessary } = this.props;

        if(this.state.content !== content){
            updateContent(id, this.state.content);
            updateNodeWidgetDataIfNecessary(id, this.state.content);
        }
    }

    render() {
        const { counter, parentId, childIds, id, focused, inReadMode, externalList,
                collapsed, visible, selected, morphedContent, widgetDataUpdating } = this.props;
        const { content, suggestions } = this.state;

        var bulletClasses = "item";
        if(focused){
            bulletClasses += ' focused';
        }
        if(visible === false){
            bulletClasses += ' hidden';
        }
        if(selected){
            bulletClasses += ' selected';
        }
        if(childIds.length > 0){
            bulletClasses += ' has-children';
        } else {
            bulletClasses += ' no-children';
        }

        var showToggleExpansionIcon = childIds.length;
        var childNodeClasses = 'children';
        if(collapsed){
            childNodeClasses = childNodeClasses + ' collapsed';
        }

        return (
            <div className={bulletClasses} onKeyDown={this.handleOnKeyDown}>
            {typeof parentId !== 'undefined' ?
                <div className="depth">
                
                <div className="bullet-container" onClick={this.handleOnToggleExpansionClick}>
                    <div className="outer-circle"></div>
                    <div className="inner-circle"></div>
                </div>
                <div className="content" onClick={this.handleOnClick} onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave} onPaste={this.handlePaste}>
                    {focused ? 
                        <MentionsInput
                            singleLine
                            value={content}
                            onChange={this.handleChange}
                            style={ defaultStyle({ singleLine: true }) }
                            placeholder={""}
                            focused={this.props.focused}
                            onSelect={this.onSelect}
                            onBlur={this.handleOnBlur}>

                        <Mention onAdd={this.onAdd} onRemove={this.onRemove} data={ suggestions } style={defaultMentionStyle} />
                        </MentionsInput>
                    :
                    this.renderNodeWidgets()}

                    {externalList ? 
                    <ul className="external-data-children">
                    {externalList.map((item) => {
                        return <li>
                            {item.title} <br/>
                            <small>{item.points} | {item.author} | {item.numberOfComments} comments</small>
                        </li>
                    })}
                    </ul>
                    : null }
                </div>
                </div>:
                null
            }
            <div className={childNodeClasses}>
                {childIds.map(this.renderChild)}
            </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return state.tree.present.filter(node => node.id === ownProps.id)[0];
}

const ConnectedNode = connect(mapStateToProps, actions)(Node)
export default ConnectedNode

// {showToggleExpansionIcon ? 
//                 <div className="toggle-expansion" onClick={this.handleOnToggleExpansionClick}>
//                     {collapsed ?
//                         <strong>+</strong>
//                         :
//                         <strong>-</strong>
//                     }
//                 </div>
//                 : null }
