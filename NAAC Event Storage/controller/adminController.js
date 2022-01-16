var User = require('../models/users');
// var Meta = require('../models/meta');
var Template = require('../models/template');
var User = require('../models/users');
var bcrypt = require('bcrypt');
var passport = require('passport');

const AdminRegisterGet = (req, res, next) => {
    User.findOne({
        role: "ADMIN"
    }, (err, users) => {
        if (err) {
            res.status(500).send({
                message: "Internal Server Error"
            })
        } else if (users === null) {
            res.render("admin/register", {
                title: "Register",
                error: ""
            });
        } else {
            res.redirect("http://localhost:3000/");
        }
    })
}
const AdminRegisterPost = (req, res, next) => {
    const {
        username,
        email,
        password1,
        password2
    } = req.body;

    console.log(req.body);
    if (password1 !== password2) {
        res.render("admin/register", {
            title: "Register",
            error: "* Password not matching"
        });
    } else if (username === "" || email === "" || password1 === "" || password2 === "") {
        res.render("admin/register", {
            title: "Register",
            error: "* All fields are required"
        });
    } else {
        User.findOne({
            username: username
        }, (err, users) => {
            if (err) {
                res.status(500).send({
                    message: "Internal Server Error"
                })
            } else if (users !== null) {
                res.render("admin/register", {
                    title: "Register",
                    error: "* exists"
                });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password1, salt, (err, hash) => {
                        if (err) {
                            res.status(500).send({
                                message: "Internal Server Error"
                            })
                        } else {
                            const user = new User({
                                username: username,
                                email: email,
                                password: hash,
                                salt: salt.toString('hex'),
                                role: "ADMIN"
                            });
                            user.save((err, user) => {
                                if (err) {
                                    res.status(500).send({
                                        message: "Internal Server Error"
                                    })
                                } else {
                                    // let meta = new Meta({
                                    //     _id: user._id,
                                    // });
                                    // meta.save();
                                    res.redirect("http://localhost:3000/");
                                }
                            })
                        }
                    })
                })
            }
        })
    }
}
const AdminPostLogin = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            res.status(401).send({
                message: "authentication error"
            })
        } else if (!user) {
            res.status(401).send({
                message: "Incorrect Username or Password"
            });
        } else {
            req.logIn(user, (err) => {
                if (err) {
                    res.status(401).send({
                        message: "authentication error"
                    })
                } else {
                    const data = {
                        isAuthenticated: true,
                        isAdmin: user.role === "ADMIN" ? true : false,
                        username: user.username,
                        email: user.email
                    }
                    res.status(200).send({
                        message: "Login Successful",
                        data: data
                    });
                }
            });
        }
    })(req, res, next);
}
const AdminPostLogout = (req, res, next) => {
    req.logout();
    res.status(200).send({
        message: "Logout Successful"
    });
}
const AdminGetDashboard = async (req, res, next) => {

    const meta = await User.findById(req.user._id)
        .populate({
            model: 'Template',
            path: 'template',
        })
        .sort({
            isActive: -1
        })
        .exec();

    res.status(200).send({
        activeTemplate: meta.template[0] ? Object(meta.template[0]) : null,
        Template: meta.template ? meta.template.slice(1) : []
    });

}
const AdminGetDashboardActiveTemplate = (req, res, next) => {
    Template.exists({
        isActive: true
    }).then((exists) => {
        if (exists) {
            Template.findOne({
                    isActive: true
                })
                .then((template) => {
                    console.log(template.layout)

                    res.status(200).send({
                        data: template.layout,
                        templateID: template._id
                    });
                });
        } else {
            User.findById(req.user._id).then((user) => {
                const template = new Template({
                    name: "Untitled Form",
                });
                user.template.push(template._id);
                // console.log(user);
                user.save((err, user) => {
                    template.save().then((template) => {
                        res.status(200).send({
                            data: template.layout,
                            templateID: template._id
                        });
                    });
                });
            });
        }
    })
}
const AdminPostData = (req, res, next) => {
    Template.findOne({
        _id: req.body.layout.templateID
    }).then((template) => {
        if (template !== null) {
            template.layout = req.body.layout.data;
            template.save().then((template) => {
                res.status(200).send({
                    message: "Template Updated"
                });
            });
        }else{
            res.status(404).send({
                message: "Something went Wrong"
            });
        }
    });
}

module.exports = {
    AdminRegisterGet,
    AdminRegisterPost,
    AdminPostLogin,
    AdminPostLogout,
    AdminGetDashboard,
    AdminGetDashboardActiveTemplate,
    AdminPostData
    // AdminGetData,
};


// Template({
//     layout: req.body.data
// }).save();


// const AdminGetData = (req, res, next) => {
//     const data = [{
//             title: 'section 1',
//             type: 'fill',
//             parent: null,
//             level: 0,
//             children: false
//         },
//         {
//             title: 'section 2',
//             type: 'section',
//             parent: null,
//             level: 0,
//             children: true
//         },
//         {
//             title: 'section 2.1',
//             type: 'fill',
//             parent: 1,
//             level: 1,
//             children: false
//         },
//         {
//             title: 'section 2.2',
//             type: 'section',
//             parent: 1,
//             level: 1,
//             children: true
//         },
//         {
//             title: 'section 2.2.1',
//             type: 'fill',
//             parent: 3,
//             level: 2,
//             children: false
//         },
//         {
//             title: 'section 2.3',
//             type: 'section',
//             parent: 1,
//             level: 1,
//             children: true
//         },
//         {
//             title: 'section 2.3.1',
//             type: 'fill',
//             parent: 5,
//             level: 2,
//             children: false
//         },
//         {
//             title: 'section 3',
//             type: 'section',
//             parent: null,
//             level: 0,
//             children: true
//         },
//         {
//             title: 'section 3.1',
//             type: 'fill',
//             parent: 7,
//             level: 1,
//             children: false
//         }, {
//             title: 'section 4',
//             type: 'fill',
//             parent: null,
//             level: 0,
//             children: false
//         }
//     ];
//     res.send(data);
// }