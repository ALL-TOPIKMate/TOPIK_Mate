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


// Firebase Cloud Database 
const collectionName = 'test';



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


const assetsDirPath = path.join(__dirname, 'assets');
const uploadsDirPath = path.join(__dirname, 'uploads');


// assects 디렉토리 생성 - 결과 JSON 저장 디렉토리
if (!fs.existsSync(assetsDirPath)) {
	fs.mkdirSync(assetsDirPath);
	console.log(`Created a directory. Path: ${assetsDirPath}`);
}

if (!fs.existsSync(uploadsDirPath)) {
	fs.mkdirSync(uploadsDirPath);
	console.log(`Created a directory. Path: ${uploadsDirPath}`);
}



// Firebase 커넥션 초기화
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

		csvtojson({

			// 커스텀 파서 만들기 - 필드 타입 정의 가능
			colParser: {
				"PRB_ID": "string",
				"PRB_RSC": "string",
				"PRB_SECT": "string",
				"PRB_NUM": "string",
				"PRB_CORRT_ANSW": "string",

				"PRB_POINT": "number", // 점수 계산을 위해 number로 지정해야 함
				"PRB_MAIN_CONT": "string",
				"PRB_SUB_CONT": "string",
				"PRB_TXT": "string",
				"PRB_SCRPT": "string",
				"AUD_REF": function () {

				},
				"IMG_REF": function () {

				},
				"PRB_CHOICE1": "string",
				"PRB_CHOICE2": "string",
				"PRB_CHOICE3": "string",
				"PRB_CHOICE4": "string",
				"연속 문제(여부)": "omit",

				"AUD_SCRPT": "string"
			},

			// 자동 타입 체크 
			// - colParser 뒤에 위치 시켜서 사용자가 타입을 지정하지 않은 필드에 대한 자동 타입 체크
			checkType: true,
		})
			.fromFile(path.join(__dirname, filePath))
			.then(data => {

				// data -> JSON 오브젝트로 사용하기
				jsonStr = JSON.stringify(data);
				jsonObj = JSON.parse(jsonStr); // 배열


				// Firebase Cloud Database에 bulk할 JSON 형태
				/**
				 * *************** dataset *************** 
				 * {
				 *     "컬렉션 이름": {
				 *         "도큐먼트ID": {
				 *             "필드1": "값1",
				 *             "필드2": "값2", ...
				 *         },
				 *         "도큐먼트ID": { 
				 *             ... 
				 *         },
				 *     }
				 * }
				 */
				let dataset = new Object();
				let collection = new Object();

				// 문제 데이터 순회
				jsonObj.forEach(function(element, idx) {

					// 각 도큐먼트(문제) ID를 PRB_ID로 지정
					console.log(element.PRB_ID);
					let prbId = element.PRB_ID;

					collection[`${prbId}`] = element;
					
				});

				dataset[`${collectionName}`] = collection;


				// JSON 파일 저장
				fs.writeFileSync(jsonfilepath, JSON.stringify(dataset, null, 4));
				

				// Firebase에 JSON 적재
				jsonToFirestore(jsonfilepath);
			})

		res.sendStatus(200);
	}

});




//Express 서버 시작
app.listen(port, () => {
    console.log(`서버가 실행됩니다. http:localhost:${port}`);
});
