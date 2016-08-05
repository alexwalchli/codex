import firebase from 'firebase';

export const SUBSCRIBE_TO_USER_PAGES = 'SUBSCRIBE_TO_USER_PAGES';

export function subscribeToUserPages(){
    return (dispatch, getState) => {
        firebase.database().ref('userPages').on('value', function(snapshot) {
            alert(snapshot);
        });
    };
}