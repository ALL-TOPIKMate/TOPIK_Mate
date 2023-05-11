const express = require('express');

const app = express();
const router = express.Router();
const session = require('express-session');

require('dotenv').config();

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use('/', router);

router.get('/', (req, res) => {

    if (!req.session.isLogined) {
        res.render('login.ejs');
    } else {
        console.log(`Login. Name: ${req.session.name}`);
        res.render('main.ejs', {
            name: req.session.name,
        });
    }
});

module.exports = app;
