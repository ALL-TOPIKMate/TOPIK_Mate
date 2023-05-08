const admin = require("firebase-admin");
// const firestoreService = require('firestore-export-import');
const firebaseConfig = require("./config");
const serviceAccount = require('./serviceAccount.json');

class firebase {

    connect() {
        // Firebase 커넥션 초기화
        console.log('Initializing Firebase');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: firebaseConfig.databaseURL
        });
        console.log('Firebase Initialized');
    }

}

module.exports = firebase;