var express = require('express');
var router = express.Router();


var {
    AuthenticateAdmin
} = require('../../middleware/Authenticate');
var {
    AdminRegisterGet,
    AdminRegisterPost,
    AdminPostLogin,
    AdminPostLogout,
    AdminGetDashboard,
    AdminGetDashboardActiveTemplate,
    AdminGetData,
    AdminPostData
} = require('../../controller/adminController');



router.route('/register').get(AdminRegisterGet).post(AdminRegisterPost);
router.post("/login", AdminPostLogin);
router.post("/logout", AdminPostLogout);

router.use(AuthenticateAdmin);

router.get('/dashboard', AdminGetDashboard);
router.get('/dashboard/create', AdminGetDashboardActiveTemplate);
router.route('/data').post(AdminPostData);

module.exports = router;