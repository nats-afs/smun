import firebase from 'firebase'

export const config = {
  apiKey: "AIzaSyCbsYvnWl77-ogBrBesLZ5r97mrmPaJpYY",
  authDomain: "sm-app-a47c8.firebaseapp.com",
  databaseURL: "https://sm-app-a47c8.firebaseio.com",
  projectId: "sm-app-a47c8",
  storageBucket: "sm-app-a47c8.appspot.com",
  messagingSenderId: "264443462543"
}

let app = firebase.initializeApp(config);
export const db = app.database()

export const claimantRef = db.ref('claimants');
export const galleryRef = db.ref('gallery');
export const orgRef = db.ref('org');
export const newsRef = db.ref('news');
export const categoryRef = db.ref('category');
export const noteRef = db.ref('note');
export const eventRef = db.ref('event');
export const placeRef = db.ref('place');
export const docsRef = db.ref('documents');
export const firebaseAuth = firebase.auth;

// export function firebaseListener(func) {
//   firebaseAuth().onAuthStateChanged(user => {
//     if (user) {
//       console.log("User log in success", user);
//       func(true, user)
//     } else {
//       console.log("User log in failed", user);
//       func(false)
//     }
//   }, error => console.log(error));
// }