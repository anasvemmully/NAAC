var express = require("express");
var router = express.Router();

var { AuthenticateAdmin } = require("../../middleware/Authenticate");
var { AuthenticateClient } = require("../../middleware/ClientAuthenticate");
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
  AdminDeleteUser,
  AdminPostData,
  AdminGetDashBoardManageTemplate,
  AdminPosttDashBoardManageTemplate,
  AdminPostRoleUser,
  AdminPostRoleUserGet,
  AdminDeleteRoleUser,
  AdminDeleteForm,
  AdminCompletePostForm,
  AdminCompleteGetForm,

  AdminPostDashboardView,
  AdminPostFileInfo,
  AdminPostUploadFile,

  ClientPostLogin,
  ClientOTPGetVerification,
  ClientPostResendOTP,
  ClientPostLogout,
  ClientGetDashboard,
  ClientPostDashboard,

  ClientPostUploadFile,
  ClientGetDownloadFile,
  ClientPostFileInfo,
} = require("../../controller/adminController");

router.route("/register").get(AdminRegisterGet).post(AdminRegisterPost);
router.post("/login", AdminPostLogin);
router.post("/logout", AdminPostLogout);

router.route("/d/login").get(ClientOTPGetVerification).post(ClientPostLogin);
router.route("/d/logout").post(ClientPostLogout);
router.route("/d/resend-otp").post(ClientPostResendOTP);
router
  .route("/d/dashboard")
  .get(AuthenticateClient, ClientGetDashboard)
  .post(AuthenticateClient, ClientPostDashboard);

router.route("/d/upload").post(AuthenticateClient, ClientPostUploadFile);
router.route("/d/download").get(AuthenticateClient, ClientGetDownloadFile);
router.route("/d/file").post(AuthenticateClient, ClientPostFileInfo);

router.use(AuthenticateAdmin);

router.get("/dashboard", AdminGetDashboard);
router
  .route("/dashboard/create/:TemplateId")
  .get(AdminGetDashboardActiveTemplate)
  .post(AdminPostDashboardActiveTemplate);

router.route("/dashboard/view").post(AdminPostDashboardView);
router.route("/dashboard/file").post(AdminPostFileInfo);
router.route("/dashboard/upload-file").post(AdminPostUploadFile);

router.route("/dashboard/delete-form").post(AdminDeleteForm);
router.route("/dashboard/form-complete").get(AdminCompleteGetForm).post(AdminCompletePostForm);

router
  .route("/dashboard/role")
  .post(AdminPostRoleUser)
  .delete(AdminDeleteRoleUser);

router.route("/dashboard/get-role").post(AdminPostRoleUserGet);

router
  .route("/dashboard/manage/:TemplateId")
  .get(AdminGetDashBoardManageTemplate)
  .post(AdminPosttDashBoardManageTemplate);

router.route("/data").post(AdminPostData);

router
  .route("/user")
  .get(AdminGetUser)
  .post(AdminPostUser)
  .delete(AdminDeleteUser);

module.exports = router;
