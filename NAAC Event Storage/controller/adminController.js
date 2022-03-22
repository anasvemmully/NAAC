var User = require("../models/users");
// var Meta = require('../models/meta');
var Template = require("../models/template");
var Member = require("../models/member");
var User = require("../models/users");
var bcrypt = require("bcrypt");
var passport = require("passport");

const AdminRegisterGet = (req, res, next) => {
  User.findOne(
    {
      role: "ADMIN",
    },
    (err, users) => {
      if (err) {
        res.status(500).send({
          message: "Internal Server Error",
        });
      } else if (users === null) {
        res.render("admin/register", {
          title: "Register",
          error: "",
        });
      } else {
        res.redirect("http://localhost:3000/");
      }
    }
  );
};
const AdminRegisterPost = (req, res, next) => {
  const { username, email, password1, password2 } = req.body;

  console.log(req.body);
  if (password1 !== password2) {
    res.render("admin/register", {
      title: "Register",
      error: "* Password not matching",
    });
  } else if (
    username === "" ||
    email === "" ||
    password1 === "" ||
    password2 === ""
  ) {
    res.render("admin/register", {
      title: "Register",
      error: "* All fields are required",
    });
  } else {
    User.findOne(
      {
        username: username,
      },
      (err, users) => {
        if (err) {
          res.status(500).send({
            message: "Internal Server Error",
          });
        } else if (users !== null) {
          res.render("admin/register", {
            title: "Register",
            error: "* exists",
          });
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password1, salt, (err, hash) => {
              if (err) {
                res.status(500).send({
                  message: "Internal Server Error",
                });
              } else {
                const user = new User({
                  username: username,
                  email: email,
                  password: hash,
                  salt: salt.toString("hex"),
                  role: "ADMIN",
                });
                user.save((err, user) => {
                  if (err) {
                    res.status(500).send({
                      message: "Internal Server Error",
                    });
                  } else {
                    // let meta = new Meta({
                    //     _id: user._id,
                    // });
                    // meta.save();
                    res.redirect("http://localhost:3000/");
                  }
                });
              }
            });
          });
        }
      }
    );
  }
};
const AdminPostLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.status(401).send({
        message: "authentication error",
      });
    } else if (!user) {
      res.status(401).send({
        message: "Incorrect Username or Password",
      });
    } else {
      req.logIn(user, (err) => {
        if (err) {
          res.status(401).send({
            message: "authentication error",
          });
        } else {
          const data = {
            isAuthenticated: true,
            isAdmin: user.role === "ADMIN" ? true : false,
            username: user.username,
            email: user.email,
          };
          res.status(200).send({
            message: "Login Successful",
            data: data,
          });
        }
      });
    }
  })(req, res, next);
};
const AdminPostLogout = (req, res, next) => {
  req.logout();
  res.status(200).send({
    message: "Logout Successful",
  });
};
const AdminGetDashboard = async (req, res, next) => {
  const meta = await User.findById(req.user._id)
    .populate({
      model: "Template",
      path: "template",
      options: { sort: { isActive: -1 } },
    })
    .exec();

  res.status(200).send({
    Template: meta.template,
  });
};

const AdminPostData = (req, res, next) => {
  Template.findOne({
    _id: req.body.templateID,
  }).then((template) => {
    if (template !== null) {
      template.layout = req.body.data;
      template.name = req.body.name;
      template.save().then((template) => {
        res.status(200).send({
          message: "Template Updated",
        });
      });
    } else {
      res.status(404).send({
        message: "Something went Wrong",
      });
    }
  });
};

const AdminGetDashboardActiveTemplate = async (req, res, next) => {
  const { TemplateId } = req.params;

  try {
    await Template.exists({ _id: TemplateId }).then((exists) => {
      if (exists) {
        Template.findOne({
          _id: TemplateId,
        })
          .then((template) => {
            if (template !== null) {
              res.status(200).send({
                message: "Template Found",
                data: {
                  id: template._id,
                  name: template.name,
                  layout: template.layout,
                },
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Internal Server Error",
            });
          });
      } else {
        User.findById(req.user._id).then((user) => {
          const template = new Template({
            name: "Untitled Form",
          });
          user.template.push(template._id);
          user.save((err, user) => {
            if (err) {
              res.status(500).send({
                message: "Internal Server Error",
              });
            }
            template.save().then((template) => {
              res.status(200).send({
                message: "Template Created",
                data: {
                  id: template._id,
                  name: template.name,
                  layout: template.layout,
                },
              });
            });
          });
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const AdminPostDashboardActiveTemplate = async (req, res, next) => {
  const { TemplateId } = req.params;
  await Template.exists({ _id: TemplateId }).then((exists) => {
    if (exists) {
      Template.findOne({
        _id: TemplateId,
      })
        .then((template) => {
          if (template !== null) {
            template.islive = true;
            template.isActive = false;
            template.save().then((template) => {
              res.status(200).send({
                message: "Template Updated",
              });
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Internal Server Error",
          });
        });
    } else {
      res.status(404).send({
        message: "Something went Wrong",
      });
    }
  });
};

const AdminGetUser = async (req, res, next) => {
  // if (req.user.members.length === 0) {
  //   res.status(200).send({
  //     message: "Users Found",
  //     user: req.user.member,
  //   });
  // } else {
    
  // }
  await Member.find({}).then((members) => {
    console.log("members");
    res.status(200).send({
      message: "Users Found",
      user: members,
    });
  });
};

const AdminPostUser = async (req, res, next) => {
  console.log(req.body.userAdd);
  const member = new Member({
    email: req.body.userAdd,
    ParentId: req.user._id,
  });
  await member
    .save()
    .then((member) => {
      res.status(200).send({
        success : true
      });
    })
    .catch((err) => {
      res.status(200).send({
        success : false
      });
    });
};

module.exports = {
  AdminRegisterGet,
  AdminRegisterPost,
  AdminPostLogin,
  AdminPostLogout,
  AdminGetDashboard,
  AdminGetDashboardActiveTemplate,
  AdminPostDashboardActiveTemplate,
  AdminPostData,
  AdminPostUser,
  AdminGetUser,
};
