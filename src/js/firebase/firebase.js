import firebase from 'firebase';
import firebaseConfig from './config';

let firebaseApp,
    firebaseAuth,
    firebaseDb;

//if (firebase.apps.length === 0){
  firebaseApp = firebase.initializeApp(firebaseConfig);
  firebaseAuth = firebaseApp.auth();
  firebaseDb = firebaseApp.database();
//}

export { firebaseApp, firebaseAuth, firebaseDb };


