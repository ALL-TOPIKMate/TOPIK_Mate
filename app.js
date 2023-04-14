// app.js
// 서버에서 사용할 미들웨어를 정의하는 곳
const jsonToFirestore = require('./routes/import');


const express = require('express');
const serveStatic = require('serve-static');

const path = require('path');

const fs = require('fs');
const multer = require('multer');
const csvtojson = require('csvtojson');


// Firebase 관련 패키지
const admin = require("firebase-admin");
const firestoreService = require('firestore-export-import');
const firebaseConfig = require("./config");
const serviceAccount = require('./serviceAccount.json');




const app = express();
const http = require('http').createServer(app);
const port = 3000; // 서버 포트 번호




// middleware 등록
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));
app.use(express.static(path.join(__dirname, "views")));
app.use("/upload", serveStatic(path.join(__dirname, "uploads"))); //use앞은 가상주소(upload) / 뒤에는 실제 주소 (uploads)



//storage의 저장 기준 설정
var storage = multer.diskStorage({
	
	destination:function(req, file, callback) {
		
		callback(null,"uploads");
	},
	filename:function(req, file, callback) {
		
		var extension = path.extname(file.originalname);
		var basename = path.basename(file.originalname, extension);
		
		// callback(null, basename + extension); // 파일이름이 abc.txt로 들어간다.
		// callback(null,file.originalname); 위와 동일하다
		callback(null, basename + Date.now() + extension); // 파일이름 + 현재 날짜를 붙임
		//callback(null,Date.now().toString() + path.extname(file.originalname)); //현재 날짜만 붙임.
		
	},

});


// 위에서 만든 storage를 기준으로 upload
const upload = multer({
	
	storage:storage,
	limits:{
		files:10,
		fileSize: 1024 * 1024 * 1024
	},

});
 

// var errorHandler = expressErrorHandler({
	
// 	static : {
// 		"404":"./views/404.html"
// 	}
	
// });

// Firebase 초기화
console.log('Initializing Firebase');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: firebaseConfig.databaseURL
});
console.log('Firebase Initialized');


app.post('/process/file', upload.single("upload"), (req, res) => {

	if (!req.file) {
		res.send("파일이 업로드되지 않았습니다.");
	} else {

		let file = req.file;

		let originalName = file.originalname;
		let filePath = file.path;
		let extension = path.extname(originalName);
		var basename = path.basename(file.originalname, extension);

		// console.log(`file.originalname: ${originalName}`);
		// console.log(`file.path: ${filePath}`);

		// json 저장
		let dirpath = path.join(__dirname, 'assets'); // 저장 디렉토리 경로
    	let jsonfilepath = path.join(dirpath, `${basename}.json`); // 저장 파일 경로

		csvtojson()
			.fromFile(path.join(__dirname, filePath))
			.then(data => {
				fs.writeFileSync(jsonfilepath, JSON.stringify({"users": data}, null, 4));
				jsonToFirestore(jsonfilepath);
			})

		res.sendStatus(200);
	}

});




//Express 서버 시작
app.listen(port, () => {
    console.log(`서버가 실행됩니다. http:localhost:${port}`);
});