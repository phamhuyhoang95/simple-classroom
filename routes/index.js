'use strict';
var express = require('express'),
    router = express.Router();
const authCheck = require('../middleware/auth')
// add modification header
router.use(function(req, res, next) {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});

router.use('/api', require('./user'));
// apply auth check for all api
router.use(authCheck)
router.use('/task', require('./task'))
module.exports = router;
