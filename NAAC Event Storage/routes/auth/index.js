var express = require("express");
var router = express.Router();

var { AuthenticateAdmin } = require("../../middleware/Authenticate");
var {
  AdminRegisterGet,
  AdminRegisterPost,
  AdminPostLogin,
  AdminPostLogout,
  AdminGetDashboard,
  AdminGetDashboardActiveTemplate,
  AdminPostDashboardActiveTemplate,
  AdminGetUser,
  AdminPostUser,
  AdminPostData,
} = require("../../controller/adminController");

router.route("/register").get(AdminRegisterGet).post(AdminRegisterPost);
router.post("/login", AdminPostLogin);
router.post("/logout", AdminPostLogout);

router.use(AuthenticateAdmin);

router.get("/dashboard", AdminGetDashboard);
router
  .route("/dashboard/create/:TemplateId")
  .get(AdminGetDashboardActiveTemplate)
  .post(AdminPostDashboardActiveTemplate);

router.route("/data").post(AdminPostData);

router.route("/user").get(AdminGetUser).post(AdminPostUser);




module.exports = router;
