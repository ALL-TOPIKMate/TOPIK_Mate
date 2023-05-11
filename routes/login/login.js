const express = require('express');

const app = express();
const mysql = require('mysql');
const router = express.Router();

require('dotenv').config();

// const MySQLStore = require('express-mysql-session');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);


const options = {
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: '0000',
    database: 'user'
}

const sessionStore = new MySQLStore(options);

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        secure: false,
        httpOnly: true,
    },
}));
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use('/', router);


const connection = mysql.createConnection(options);
connection.connect()


router.get('/', (req ,res) => {
    res.render('login.ejs');
});


router.post('/', (req, res) => {

    let name = req.body.name;
    let password = req.body.password;
    // let sql_insert = {name: name, password: password};

    connection.query('select * from user_info where name=?', [name], (err, nameRows) => {
        if (nameRows.length) {
            if (nameRows[0].name === name) {
                connection.query('select * from user_info where password=?', [password], (err, pwRows) => {
                    if (err) {
                        // throw err
                        console.log(err);
                    }

                    if (pwRows.length) {
                        req.session.name = nameRows[0].name;
                        req.session.password = pwRows[0].password;
                        req.session.isLogined = true;
                        req.session.save(() => {
                            res.redirect('/');
                        });
                    } else {
                        res.json({'result': 'pwfalse'});
                    }
                });
            }
        } else {
            // 아이디가 잘못됨
            res.json({'result': 'idfalse'});
        }
    });
});


module.exports = app;
