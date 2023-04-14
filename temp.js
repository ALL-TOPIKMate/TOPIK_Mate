// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtPXqTHOdY2r8Dds67AUDfgqWjV4kYJMY",
  authDomain: "studyfirebase-c8b5c.firebaseapp.com",
  projectId: "studyfirebase-c8b5c",
  storageBucket: "studyfirebase-c8b5c.appspot.com",
  messagingSenderId: "9267265418",
  appId: "1:9267265418:web:65a1064755804fe1ba1273"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);





var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://studyfirebase-c8b5c-default-rtdb.firebaseio.com"
});
