// Imports
const admin = require("firebase-admin");
const firestoreService = require('firestore-export-import');
const firebaseConfig = require("../config.js");
const serviceAccount = require('../serviceAccount.json');


// JSON to firestore
const jsonToFirestore = async (filepath) => {
    try {
        // console.log('Initializing Firebase');
        // admin.initializeApp({
        //     credential: admin.credential.cert(serviceAccount),
        //     databaseURL: firebaseConfig.databaseURL
        // });
        // console.log('Firebase Initialized');

        await firestoreService.restore(filepath);

        console.log("Upload Success");

    } catch (err) {
        console.log(err);
    }
};

// Exports
module.exports = jsonToFirestore;