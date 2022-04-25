var express = require("express");
var router = express.Router();
var path = require("path");
var { PublicGetAllTemplate } = require("../controller/indexController");
var Template = require("../models/template");

/* GET home page. */
// router.get("/view/:templateId", index1);
// router.post("/view/download", DownloadFile);

router.route("/view/template").get(PublicGetAllTemplate);

module.exports = router;
