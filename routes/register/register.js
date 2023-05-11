const express = require('express');

const app = express();
const mysql = require('mysql');
const router = express.Router();

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use('/', router);


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'user'
});

connection.connect()

router.get('/', (req, res) => {
    res.render('register.ejs');
})

router.post('/', (req, res) => {

    const name = req.body.name;
    const password = req.body.password;

    let sql_insert = {name: name, password: password}

    connection.query('select name from user_info where name=?', [name], (err, rows) => {
        if (rows.length) {
            res.json({'result': 'fail'});
        } else {
            connection.query('insert into user_info set?', sql_insert, (err, rows) => {
                if (err) {
                    // throw err
                    console.log(err);
                }

                console.log(`Successfully register. Name: ${name}`);
                res.redirect('/');
            });
        }
    })
});

module.exports = router;
