// router는 controller에만 의존한다.

const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller.mainView);

// 파일 처리를 위한 라우트
router.post('/files', controller.fileProcess);

module.exports = router;