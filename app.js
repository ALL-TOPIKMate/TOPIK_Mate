// app.js
// 서버에서 사용할 미들웨어를 정의하는 곳

const express = require('express');
const path = require('path');
var serveStatic = require("serve-static"); //특정 폴더를 패스로 접근 가능하게 하는것.
var expressErrorHandler = require("express-error-handler");
// var cookieParser = require("cookie-parser");
// var expressSession = require("express-session");


const fs = require('fs');
const multer = require('multer');
const csvtojson = require('csvtojson');
// const { convertCsv2JSON } = require('./routes/fileController');


const app = express();
const http = require('http').createServer(app);
const port = 3000; // 서버 포트 번호



// middleware 등록
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));
app.use(express.static(path.join(__dirname, "views")));
// app.use("/public",serveStatic(path.join(__dirname,"public"))); //public (실제)폴더의 이름을 써준것
app.use("/upload",serveStatic(path.join(__dirname, "uploads"))); //use앞은 가상주소(upload) / 뒤에는 실제 주소 (uploads)



//storage의 저장 기준 설정
var storage = multer.diskStorage({
	
	destination:function(req, file, callback) {
		
		callback(null,"uploads");
	},
	filename:function(req, file, callback) {
		
		var extension = path.extname(file.originalname);
		var basename = path.basename(file.originalname, extension);
		
		callback(null, basename + extension); // 파일이름이 abc.txt로 들어간다.
		// callback(null,file.originalname); 위와 동일하다
		// callback(null, basename + Date.now() + extension); // 파일이름 + 현재 날짜를 붙임
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
	preservePath: true,

});
 
 
//라우터 객체 추가 
var router = express.Router();


const showUploadedFiles = (req, res, next) => {

    console.log("/process/file 호출.."); 

    try {
		
		let file = req.file; // 파일 정보를 배열로 받음

		console.log(`file: ${file}`);
		
		//console.log(req.files[0]); //req로 넘어온 files의 0번째 출력
		//console.log(req.files[1]);
		
		//파일 정보를 저장할 변수
		let originalName = file.originalname;
		let fileName = file.filename;
		let mimeType = file.mimetype
		let size = file.size;
		
		res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
		res.write("<h1>파일 업로드 성공</h1>");
		
		res.write("<hr/>");
		res.write("<div>원본파일명 : " + originalName + "</div>");
		res.write("<div>저장파일명 : " + fileName + "</div>");
		res.write("<div>MimeType : " + mimeType + "</div>");
		res.write("<div>파일크기 : " + size + "</div>");
		
        req.data = path.join(__dirname, 'uploads', fileName);

		console.log(`req.data: ${req.data}`);

        next();
		
		
	} catch (err) {
		console.dir(err.stack); // 에러가 있으면 뿌려라  == e.stack
	}

};

app.use(showUploadedFiles);

const convertCsv2JSON = (req, res) => {
    var dirpath = path.join(__dirname, 'assets');
    var jsonfilepath = "";

    console.log(`convertCsvToJSON 내부. req.data: ${req.data}`);

    try {

        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath);
        }

        jsonfilepath = path.join(dirpath, `${path.parse(req.data).name}.json`);

        csvtojson()
            .fromFile(req.data)
            .then(data => {
                fs.writeFileSync(jsonfilepath, JSON.stringify({"users": data}, null, 4));
            })

        res.data = jsonfilepath

        // next();

    } catch (err) {
        console.log(err);
    }
}

app.use(convertCsv2JSON);

 
// 라우팅 함수 등록 - https://backendcode.tistory.com/131
// router.route("/process/file").post(upload.array("upload", 2), showUploadedFiles, convertCsv2JSON);
router.route("/process/file").post(upload.single("upload"), showUploadedFiles, convertCsv2JSON);
 
 
//라우터 객체를 app객체에 추가
app.use("/", router);
 

var errorHandler = expressErrorHandler({
	
	static : {
		"404":"./views/404.html"
	}
	
});
 
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
 
 
//Express 서버 시작
app.listen(port, () => {
    console.log(`서버가 실행됩니다. http:localhost:${port}`);
});