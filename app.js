// app.js
// 서버에서 사용할 미들웨어를 정의하는 곳

const express = require('express');
const upload = require('express-fileupload');
const routes = require('./routes/'); // index.js는 /와 같으므로 생략 가능


const fs = require('fs');
const path = require('path');


const csv2Json = require('csvtojson');

const app = express();
const http = require('http').createServer(app);
const port = 3000; // 서버 포트 번호



// middleware 등록
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));
app.use(upload());
// enable static files pointing to the folder "public"
app.use(express.static(path.join(__dirname, "views")));
app.use(routes);


// upload files to server
app.post('/files', (req, res) => {
    
    // 리퀘스트가 파일을 포함하는지, 오브젝트 정의 여부를 통해 확인
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }

    // submit에서 uploadFile 속성값을 가져오기
    const file = req.files.uploadFile;
    const filepath = __dirname + "/files/" + file.name;

    fs.mkdir(path.join(__dirname, 'files'), (err) => {
        if (err) {
            return console.log(err);
        }
        console.log('Directory created successfully!');
    })

    /**
     * 파일 확장자 확인
     */

    // save the file
    file.mv(filepath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        console.log(`Original File Saved!`);
    });
    
    // save the file as json
    var resultFileName = csvToJSON(filepath);
    console.log(`JSON File Saved at ${resultFileName}`);
    
    jsonToFirestore(resultFileName);

    res.status(200).send(`Success!`);

});


/**
 * Convert csv to json and save
 * 
 */
function csvToJSON(filepath) {

    // get file name witdout the extension
    var filename = path.parse(filepath).name;
    var resultFileName = path.join(__dirname, 'files', `${filename}.json`);

    csv2Json()
        .fromFile(filepath)
        .then(data => {
            // console.log(data)
            // save json file

            fs.writeFile(resultFileName, JSON.stringify({"users": data}, null, 4), err => {
                if (err) {
                    console.log(`Error: ${err}`);
                }

                console.log(`Saved ${resultFileName}`)

            })
        })
        .catch(err => {
            console.log(err);
        })

        return resultFileName;
}


app.listen(port, () => {
    console.log(`서버가 실행됩니다. http:localhost:${port}`);
});