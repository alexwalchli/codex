import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configure-store';
import generateTree from './generate-tree';
import App from './components/app';
import userPageActions from './actions/user-pages';
import { subscribeToAuthStateChanged } from './actions/auth';

const initialTree = generateTree();
const store = configureStore({
    tree: initialTree,
    auth: {}
});

setTimeout(function(){
	//store.dispatch( userPageActions.subscribeToUserPages() );
});

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

subscribeToAuthStateChanged(store.dispatch);
