import firebase from 'firebase';
require('@firebase/app');

var firebaseConfig = {
  apiKey: 'AIzaSyChTbiPCKQcKXBfbadOGiTulO7TUHQnJYw',
  authDomain: 'barter-system-app-3bf8a.firebaseapp.com',
  projectId: 'barter-system-app-3bf8a',
  storageBucket: 'barter-system-app-3bf8a.appspot.com',
  messagingSenderId: '362536555782',
  appId: '1:362536555782:web:1093e7c3ca8bd4738cba87',
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore(); 
