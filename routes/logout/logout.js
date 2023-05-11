const express = require('express');
const router = express.Router();

const app = express();
const session = require('express-session');

require('dotenv').config();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}))
app.use('/', router);

router.get('/', (req, res) => {
    if (req.session.isLogined) {

        console.log(`Logout. Name: ${req.session.name}`);

        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
        })
        res.redirect('/');
    }
});

module.exports = router;
