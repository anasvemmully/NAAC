var express = require("express");
var router = express.Router();
var path = require("path");
var { index1, DownloadFile } = require("../controller/indexController");
var Template = require("../models/template");

/* GET home page. */
router.get("/view/:templateId", index1);
router.post("/view/download", DownloadFile);

module.exports = router;
