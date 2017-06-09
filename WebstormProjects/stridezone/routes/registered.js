const express = require('express');
const router = express.Router();

router.get('/thankyou', function (req, res, next) {
 res.render('registered');
});
module.exports = router;