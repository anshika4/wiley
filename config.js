import * as firebase from 'firebase';
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyDCa7pDmwlcEpKE25iLcmjuKqEjH4HB6S4",
    authDomain: "wiley-app-34a6a.firebaseapp.com",
    projectId: "wiley-app-34a6a",
    databaseURL: "https://wiley-app-34a6a.firebaseio.com",
    storageBucket: "wiley-app-34a6a.appspot.com",
    messagingSenderId: "371711629626",
    appId: "1:371711629626:web:5c3700d1dcffb780289803",
    measurementId: "G-ZRSNJZTWS8",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();