// import fetch from 'isomorphic-fetch';
// import Endpoints from '../endpoints';
// import urlWidget from '../widgets/url-widget';
// import stockTickerWidget from '../widgets/stock-ticker-widget';
// import { ActionCreators } from 'redux-undo';

export * from './node';
export * from './auth';
export * from './user-pages';

//
// EXTERNAL DATA ACTIONS
//

// export const REQUEST_DATA = 'REQUEST_DATA';
// export const RECEIVE_DATA = 'RECEIVE_DATA';
// export const SELECT_DATASOURCE = 'SELECT_DATASOURCE';
// export const INVALIDATE_DATASOURCE = 'INVALIDATE_DATASOURCE';



// export function selectDataSource(dataSource) {
//   return {
//     type: SELECT_DATASOURCE,
//     dataSource
//   };
// }

// export function invalidateDataSource(dataSource) {
//   return {
//     type: INVALIDATE_DATASOURCE,
//     dataSource
//   };
// }

// function requestData(nodeId, dataSource) {
//   return {
//     type: REQUEST_DATA,
//     dataSource,
//     nodeId
//   };
// }

// function receiveData(nodeId, dataSource, json) {
//     return (dispatch, getState) => {
//       // update the externalDataCache
//       dispatch({
//         type: RECEIVE_DATA,
//         nodeId,
//         dataSource,
//         posts: Endpoints[dataSource].responseMapper(json),
//         receivedAt: Date.now()
//       });

//       // let the node know it has new data
//       dispatch(nodeReceivedData(nodeId, dataSource));
//   };
// }

// function fetchData(nodeId, dataSource, dataSourceParameters) {
//   return dispatch => {
//     dispatch(requestData(nodeId, dataSource));
//     var url = Endpoints[dataSource].url(dataSourceParameters);
//     return fetch(url)
//       .then(response => response.json())
//       .then(json => dispatch(receiveData(nodeId, dataSource, json)));
//   };
// }

// function shouldFetchData(state, nodeId, dataSource) {
//   const node = state.tree.present.filter(node => node.id === nodeId)[0];
//   if (!node.posts) {
//     return true;
//   } else if (node.isFetching) {
//     return false;
//   } else {
//     return node.didInvalidate;
//   }
// }

// export function fetchDataIfNeeded(nodeId, dataSource, dataSourceParameters) {
//   var dataSourceInfo = dataSource.split('.');
//   var source = dataSourceInfo[0];
//   var parameter = dataSourceInfo[1];
//   return (dispatch, getState) => {
//     if (shouldFetchData(getState(), nodeId, dataSource)) {
//       return dispatch(fetchData(nodeId, source, parameter));
//     }
//   };
// }


