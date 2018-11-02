import firebase from 'firebase/app';

require('firebase/database');
require('firebase/auth');

export let ref;
export let storageRef;
export let authRef;

export const setUpFirebase = () => {
  const config = {
    apiKey: 'AIzaSyAurCabmoak3wLR4TkvTvvMW-urlW5tqbQ',
    authDomain: 'pacalendar.firebaseapp.com',
    databaseURL: 'https://pacalendar.firebaseio.com/',
    projectId: 'pacalendar',
    storageBucket: 'pac-event-app.appspot.com',
    messagingSenderId: '751145285044',
  };

  firebase.initializeApp(config);

  const db = firebase.database();
  const bucket = firebase.storage().ref('images');

  ref = db.ref();
  authRef = firebase.auth();
  storageRef = bucket;
};
