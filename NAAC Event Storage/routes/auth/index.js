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

  //version2 updates
  AdminTemplateAddSection,
  AdminTemplateAddChild,
  AdminTemplateUpdateChild,
  AdminTemplateDeleteChild,
  AdminPostDownloadFileInfo,
  AdminPostKeyword,
  AdmingetKeyword,
  AdminDeleteKeyword,
  AdminPutKeyword,
  AdminAcceptingPostForm,
  AdminUpdateFormName,

  AdminPostDashboardView,
  AdminPostFileInfo,
  AdminPostUploadFile,

  AdminClientPostDeleteFile,

  ClientPostLogin,
  ClientOTPGetVerification,
  ClientPostResendOTP,
  ClientPostLogout,
  ClientGetDashboard,
  ClientPostDashboard,

  ClientPostUploadFile,
  ClientGetDownloadFile,
  ClientPostFileInfo,

  PublicGetAllTemplate,
  PublicGetImage,
  PublicDownloadFile
} = require("../../controller/adminController");



router.get("/view/template", PublicGetAllTemplate);
router.get("/view/upload/:file", PublicGetImage);
router.get("/view/download", PublicDownloadFile);

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

// router.route("/d/upload").post(AuthenticateClient, ClientPostUploadFile);
// router.route("/d/download").get(AuthenticateClient, ClientGetDownloadFile);
// router.route("/d/file").post(AuthenticateClient, ClientPostFileInfo);
// router.route("/d/delete").post(AuthenticateClient, AdminClientPostDeleteFile);
router.route("/d/template/getFile").post(AuthenticateClient, AdminPostFileInfo);
router
  .route("/d/template/upload-file")
  .post(AuthenticateClient, AdminPostUploadFile);
router
  .route("/d/template/delete")
  .post(AuthenticateClient, AdminClientPostDeleteFile);
router
  .route("/d/template/download")
  .get(AuthenticateClient, AdminPostDownloadFileInfo);

router.use(AuthenticateAdmin);

router.get("/dashboard", AdminGetDashboard);
router
  .route("/dashboard/create/:TemplateId")
  .get(AdminGetDashboardActiveTemplate)
  .post(AdminPostDashboardActiveTemplate);

router.route("/dashboard/template/add").post(AdminTemplateAddSection);
router.route("/dashboard/template/addChild").post(AdminTemplateAddChild);
router.route("/dashboard/template/updateChild").post(AdminTemplateUpdateChild);
router.route("/dashboard/template/deleteChild").post(AdminTemplateDeleteChild);
router.route("/dashboard/template/upload-file").post(AdminPostUploadFile);
router.route("/dashboard/template/getFile").post(AdminPostFileInfo);
router.route("/dashboard/template/download").get(AdminPostDownloadFileInfo);
router.route("/dashboard/template/delete").post(AdminClientPostDeleteFile);

router
  .route("/dashboard/keyword")
  .post(AdminPostKeyword)
  .get(AdmingetKeyword)
  .delete(AdminDeleteKeyword)
  .put(AdminPutKeyword);

router.route("/dashboard/view").post(AdminPostDashboardView);

router.route("/dashboard/delete-form").post(AdminDeleteForm);
router.route("/dashboard/form-name").post(AdminUpdateFormName);
router
  .route("/dashboard/form-complete")
  .get(AdminCompleteGetForm)
  .post(AdminCompletePostForm);

router.route("/dashboard/form-accept").post(AdminAcceptingPostForm);

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
