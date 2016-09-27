import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configure-store';
import App from './components/app';
import { subscribeToAuthStateChanged } from './actions/firebase/firebase-subscriptions';

let stylesheet = require('../less/app.less');

const store = configureStore({
    tree: {},
    auth: {},
    userPages: {}
});

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

subscribeToAuthStateChanged(store.dispatch);
