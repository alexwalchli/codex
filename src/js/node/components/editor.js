import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';

const hashtagPlugin = createHashtagPlugin();
const linkifyPlugin = createLinkifyPlugin();

const plugins = [
  hashtagPlugin,
  linkifyPlugin,
];

export default class CoolEditor extends Component {

  constructor (props) {
    super(props)

    this.state = {
      editorState: createEditorStateWithText('')
    };
  }

  onChange (editorState) {
    this.setState({
      editorState,
    });
  }

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onChange={(editorState) => this.onChange(editorState)}
        plugins={plugins}
      />
    );
  }
}