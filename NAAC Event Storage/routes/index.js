var express = require('express');
var router = express.Router();
var path = require('path');
var {index1} = require('../controller/indexController');
var Template = require('../models/template');



/* GET home page. */
router.get('/', index1);


module.exports = router;
