const fs = require('fs');
const path = require('path');

const csvtojson = require('csvtojson');

const saveFile = (file) => {

    try {
        // var file = req.files.uploadFile;
        var dirpath = path.join(__dirname, 'files');
        var csvfilepath = path.join(dirpath, file.name);

        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath);
        }

        file.mv(csvfilepath);
        
        return csvfilepath;

    } catch (err) {
        console.log(err);
    }
}


const convertCsv2JSON = (csvfilepath) => {
    var dirpath = path.join(__dirname, 'assets');
    var jsonfilepath = "";

    try {

        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath);
        }

        jsonfilepath = path.join(dirpath, `${path.parse(csvfilepath).name}.json`);

        csvtojson()
            .fromFile(csvfilepath)
            .then(data => {
                fs.writeFileSync(jsonfilepath, JSON.stringify({"users": data}, null, 4));
            })

        return jsonfilepath;

    } catch (err) {
        console.log(err);
    }

}

module.exports = {
    saveFile,
    convertCsv2JSON
}