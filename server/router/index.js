const Router = require('express');
const router = new Router();
const controller = require('../controller/controller');

router.post('/send_mail', controller.sendMail);

module.exports = router;
