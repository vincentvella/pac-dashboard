import firebase from 'firebase/app';
require('firebase/database');
require('firebase/auth');

export let ref;

export const setUpFirebase = () => {
	let config = {
		apiKey: "AIzaSyAurCabmoak3wLR4TkvTvvMW-urlW5tqbQ",
		authDomain: "pacalendar.firebaseapp.com",
		databaseURL: "https://pacalendar.firebaseio.com/",
		projectId: "pacalendar",
		storageBucket: "pacalendar.appspot.com",
		messagingSenderId: "751145285044"
	};

	firebase.initializeApp(config);

	let db = firebase.database();

	ref = db.ref()
};
