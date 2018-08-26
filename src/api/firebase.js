import firebase from 'firebase/app';
require('firebase/database');
require('firebase/auth');


export let ref;

export const setUpFirebase = () => {
	let config = {
		apiKey: "AIzaSyCIXHLrAxOQQY9bvlOEehKBWmKNaXrcs7o",
		authDomain: "pacalendar-8192018.firebaseapp.com",
		databaseURL: "https://pacalendar-8192018.firebaseio.com",
		projectId: "pacalendar-8192018",
		storageBucket: "pacalendar-8192018.appspot.com",
		messagingSenderId: "654394868464"
	};

	firebase.initializeApp(config);

	let db = firebase.database();

	ref = db.ref()
};