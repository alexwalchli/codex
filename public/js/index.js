import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Node from './containers/node';
import Topbar from './components/top-bar';
import AppContextMenu from './containers/app-context-menu';
import configureStore from './store/configure-store';
import generateTree from './generate-tree';

console.log(Topbar);

const initialTree = generateTree();
const store = configureStore({
  tree: initialTree
});

render(
  <Provider store={store}>
  <div id="app">
    <Topbar />
    <AppContextMenu />
    <div id="tree-container">
      <Node id={'0'} />
    </div>
  </div>
  </Provider>,
  document.getElementById('root')
)
