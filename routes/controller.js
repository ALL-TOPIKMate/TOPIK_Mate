const { saveFile, convertCsv2JSON } = require('./fileController');
const jsonToFirestore = require('./import');

exports.mainView = function (req, res) {
    res.sendFile(__dirname + './views/index.html');
}

// 파일 처리 컨트롤러
// 1. 업로드된 CSV 파일 저장
// 2. JSON으로 변환하여 저장
// 3. Firebase 적재
exports.fileProcess = (req, res) => {

    if (!req.files) {
        return res.status(400).send("파일이 업로드되지 않았습니다.");
    } else {
        var file = req.files.uploadFile;

        var csvfilepath = saveFile(file);
        console.log(`파일 저장 완료. csvfilepath = ${csvfilepath}`);

        var jsonfilepath = convertCsv2JSON(csvfilepath);
        console.log(`JSON 변환 완료. jsonfilepath = ${jsonfilepath}`);
        
        jsonToFirestore(jsonfilepath);
        console.log('firebase 적재 완료');

    }
}
