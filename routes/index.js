// router는 controller에만 의존한다.

const router = require('express').Router();

const main = require('./main/main');
const register = require('./register/register');
const login = require('./login/login');
const logout = require('./logout/logout');

router.use('/', main);
router.use('/register', register);
router.use('/login', login);
router.use('/logout', logout);

// 파일 처리를 위한 라우트
// router.post('/files', controller.fileProcess);

module.exports = router;
