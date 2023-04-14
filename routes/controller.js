const { saveFile, convertCsv2JSON } = require('./fileController');
const jsonToFirestore = require('./import');

const multer = require('multer');
const path = require('path');

exports.mainView = function (req, res) {
    res.sendFile(__dirname + './views/index.html');
}

// 파일 처리 컨트롤러
// 1. 업로드된 CSV 파일 저장
// 2. JSON으로 변환하여 저장
// 3. Firebase 적재
exports.fileProcess = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const filename = `${path.basename(
                file.originalname,
                ext
            )}_${Date.now()}${ext}`;
            console.log(filename);
            done(null, filename);
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
});


