// Imports
const admin = require("firebase-admin");
const firestoreService = require('firestore-export-import');
const firebaseConfig = require("../config.js");
const serviceAccount = require('../serviceAccountTest.json');

require('dotenv').config();

const connectFirebase = () => {
    // Firebase 커넥션 초기화
    console.log('Initializing Firebase');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: firebaseConfig.databaseURL,
        storageBucket: process.env.BUCKET_NAME,
    });
    console.log(`BUCKET_NAME: ${process.env.BUCKET_NAME}`);
    console.log('Firebase Initialized');
}

const fs = require('fs');

// JSON to firestore
const jsonToFirestore = async (filepath) => {
    try {

        // bulk 업로드
        await firestoreService.restore(filepath);
    } catch(err) {
        console.log(err)
    }
};


const jsonToFirestore2 = async (jsonObj) => {

    // jsonObj = JSON.parse(jsonStr); // 배열

    let db = admin.firestore();
    let coll = db.collection('problems').doc('TEST').collection('problem-list')

    try {

        // forEach 업로드
        jsonObj.forEach((element) => {

            if (element.PRB_ID !== "") {

                coll
                    .doc(element.PRB_ID)
                    .set(element)
                    .then((docRef) => {
                        console.log(`Document written: ${docRef}`)
                    })
                    .catch((err) => {
                        console.log(`Error adding document: ${err}`)
                    })
            }


        })

        console.log("Upload Success");

    } catch (err) {
        console.log(err);
    }
};


const { getStorage } = require('firebase-admin/storage');
const path = require('path');

const imageToStorage = async (filepath) => {

    let filename = path.parse(filepath).name;
    let extension = path.parse(filepath).ext;

    const options = {
        // Storage 저장 경로 지정
        // 폴더를 지정하려면 반드시 file seperator가 슬래시(/)여야 한다.
        destination: 'images/' + `${filename}.${extension}`,
    }

    try {

        const bucket = getStorage().bucket();
        await bucket.upload(filepath, options);

        console.log("Upload Success");

    } catch (err) {
        console.log(err);
    }
}

// Exports
module.exports = { connectFirebase, jsonToFirestore, jsonToFirestore2, imageToStorage };