// const User = require("../models/users");
// const Meta = require('../models/meta');
const Template = require("../models/template");
const Member = require("../models/member");
const User = require("../models/users");
const OTP = require("../models/otp");
// const path = require("path");

const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const bcrypt = require("bcrypt");
const passport = require("passport");

require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_MAIL_USER_ID,
    pass: process.env.AUTH_MAIL_USER_PASSWORD,
  },
});

const AdminRegisterGet = (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
const AdminRegisterPost = (req, res, next) => {
  try {
    const { username, email, password1, password2 } = req.body;

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
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
const AdminPostLogin = (req, res, next) => {
  try {
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
              data: new Buffer(JSON.stringify(data)).toString("base64"),
            });
          }
        });
      }
    })(req, res, next);
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const AdminPostLogout = (req, res, next) => {
  try {
    req.logout();
    res.status(200).send({
      message: "Logout Successful",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const AdminGetDashboard = async (req, res, next) => {
  try {
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
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const AdminPostData = (req, res, next) => {
  try {
    const { name, data, templateID } = req.body;
    Template.findOne({
      _id: templateID,
    }).then((template) => {
      if (template !== null) {
        template.layout = data;
        template.name = name;
        template.save().then((template) => {
          res.status(200).send({
            message: "Template Updated",
          });
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
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
          template.layout.push({
            title: "",
            type: "section",
            parent: null,
            level: 0,
            data: [],
            keyword: null,
          });
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
  // try {
  //   const { TemplateId } = req.params;
  //   await Template.exists({ _id: TemplateId }).then((exists) => {
  //     if (exists) {
  //       Template.findOne({
  //         _id: TemplateId,
  //       })
  //         .then((template) => {
  //           if (template !== null) {
  //             template.islive = true;
  //             template.isActive = false;
  //             dict = {};
  //             template.layout.map((e, index) => {
  //               if (e.type === "item") {
  //                 for (i in e.data) {
  //                   if (e.data[i] === true) {
  //                     if (dict[index]) {
  //                       dict[index][i] = {};
  //                     } else {
  //                       dict[index] = {
  //                         [i]: {},
  //                       };
  //                     }
  //                   }
  //                 }
  //               }
  //             });
  //             template.handle.publish = dict;
  //             template.handle.role = {};
  //             template.handle.indexRole = {};
  //             template.save().then((template) => {
  //               res.status(200).send({
  //                 message: "Template Updated",
  //               });
  //             });
  //           }
  //         })
  //         .catch((err) => {
  //           res.status(500).send({
  //             message: "Internal Server Error",
  //           });
  //         });
  //     } else {
  //       res.status(404).send({
  //         message: "Something went Wrong",
  //       });
  //     }
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: "Internal Server Error",
  //   });
  // }
};

const AdminGetUser = async (req, res, next) => {
  try {
    await Member.find({ ParentID: req.user.id }).then((members) => {
      res.status(200).send({
        message: "Users Found",
        user: members,
      });
    });
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const AdminPostUser = async (req, res, next) => {
  try {
    const { userAdd, template_id } = req.body;

    const member = new Member({
      email: userAdd,
      ParentId: req.user._id,
    });
    member.template.push(template_id);

    await member
      .save()
      .then((member) => {
        res.status(200).send({
          success: true,
        });
      })
      .catch((err) => {
        throw new Error("something went wrong !");
      });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const AdminDeleteUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    await Member.findOneAndDelete({
      email: email,
    }).then(async (member) => {
      if (member !== null) {
        await User.findById(member.ParentId).then(async (user) => {
          for (i in user.template) {
            await Template.exists({
              _id: user.template[i],
            }).then(async () => {
              await Template.findById(user.template[i]).then((template) => {
                if (template.isActive === false) {
                  if (Object.keys(template.handle.role).includes(email)) {
                    for (role of template.handle.role[email]) {
                      let index =
                        template.handle.indexRole[role].indexOf(email);
                      delete template.handle.indexRole[role][index];
                    }
                  }
                  delete template.handle.role[email];
                  template.markModified("handle.role");
                  template.markModified("handle.indexRole");
                  template.save();
                }
              });
            });
          }
        });
        res.status(200).send({
          message: "User Deleted",
          success: true,
        });
        // await Template.findById({
        //   _id: template_id,
        // })
        //   .then((template) => {
        //     const temp = template.handle.role;
        //     if (Object.keys(template.handle.role).includes(email)) {
        //       const index = temp[email][0];
        //       const expand =
        //         template.handle.indexRole[index] === undefined
        //           ? []
        //           : template.handle.indexRole[index].filter((e) => e !== email);
        //       template.handle.indexRole = {
        //         ...template.handle.indexRole,
        //         [index]: [...expand],
        //       };
        //       delete temp[email];
        //     }
        //     template.handle.role = { ...temp };
        //     template.markModified("handle.role");

        //     template.save().then(() => {
        //       res.status(200).send({
        //         message: "User Deleted",
        //         success: true,
        //       });
        //     });
        //   })
        //   .catch((err) => {
        //     throw new Error("Internal Server Error");
        //   });
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const AdminGetDashBoardManageTemplate = async (req, res, next) => {
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
      }
    });
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const AdminPosttDashBoardManageTemplate = async (req, res, next) => {
  try {
    const { TemplateId } = req.params;
    await Template.exists({ _id: TemplateId }).then((exists) => {
      if (exists) {
        Template.findOne({
          _id: TemplateId,
        })
          .then((template) => {
            if (template !== null) {
              template.layout = req.body.data;
              template.name = req.body.name;
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
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const AdminPostRoleUserGet = async (req, res, next) => {
  try {
    const { id, index } = req.body;
    await Template.findById({ _id: id }).then((template) => {
      res.status(200).send({
        roles: template.handle.indexRole[index],
      });
    });
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const AdminPostRoleUser = async (req, res, next) => {
  try {
    const { email, start, end, template_id } = req.body;
    await Template.findById({ _id: template_id }).then((template) => {
      if (
        template.handle?.role === undefined ||
        template.handle?.role === null
      ) {
        template.handle.role = {};
      }
      if (Object.keys(template.handle.role).includes(email)) {
        throw new Error("User already exists !");
      } else {
        template.handle.role = {
          ...template.handle.role,
          [email]: [start, end],
        };
        if (
          template.handle?.indexRole === undefined ||
          template.handle?.indexRole === null
        ) {
          template.handle.indexRole = {};
        }
        const expand =
          template.handle.indexRole[start] === undefined
            ? []
            : template.handle.indexRole[start];
        template.handle.indexRole = {
          ...template.handle.indexRole,
          [start]: [...expand, email],
        };

        template.save().then((template) => {
          res.status(200).send({
            message: "Role Updated",
          });
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const AdminDeleteRoleUser = async (req, res, next) => {
  try {
    const { email, index } = req.body;
    await Template.findByIdAndUpdate(
      { _id: req.body.id },
      { isConfirmed: true, $unset: { "handle.role[email]": "" } }
    ).then((template) => {
      const expand =
        template.handle.indexRole[index] === undefined
          ? []
          : template.handle.indexRole[index].filter((e) => e !== email);
      template.handle.indexRole = {
        ...template.handle.indexRole,
        [index]: [...expand],
      };
      const temp = template.handle.role;
      if (Object.keys(template.handle.role).includes(email)) {
        delete temp[email];
      }
      template.handle.role = { ...temp };
      template.markModified("handle.role");
      template.save().then((template) => {
        res.status(200).send({
          message: "Role Updated",
          success: true,
        });
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong !",
      success: false,
    });
  }
};

const ClientPostLogin = async (req, res, next) => {
  //otp generation part and model saving

  try {
    const { email } = req.body;
    await OTP.deleteMany({
      email: email,
    }).then(async () => {
      await Member.findOne({ email }).then(async (member) => {
        if (member !== null) {
          const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

          const options = {
            from: process.env.AUTH_MAIL_USER_ID,
            to: email,
            subject: "OTP for Login",
            html: `<div>
            <p>
              We're happy you're here. This is your OTP, type it and fill the form
            </p>
            <div>
              <h1>${otp}</h1>
            </div>
            <div>
              Hurry up !, this OTP will expire in 1 hour
            </div>
          </div>`,
          };
          const otpModel = new OTP({
            user_id: member._id,
            email: email,
            otp: otp,
            createdAt: new Date(),
            expiresAt: new Date(new Date().getTime() + 3600000),
          });
          otpModel.save();
          transporter.sendMail(options, function (error, info) {
            if (error) {
              throw new Error("Email sending failed");
            } else {
              res.status(200).send({
                message: "OTP Sent",
                success: true,
                userid: member._id,
                email: member.email,
              });
            }
          });
        } else {
          res.status(500).send({
            status: false,
            message: "Email Not Found!",
          });
        }
      });
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const ClientOTPGetVerification = async (req, res, next) => {
  const { otp_code, id } = req.query;

  try {
    if (otp_code === undefined || id === undefined) {
      new Error("Invalid Credentials");
    } else {
      await OTP.find({
        user_id: id,
      }).then(async (e) => {
        if (e.length === 0) {
          res.status(200).send({
            status: false,
            message: "OTP expired",
          });
        } else {
          const { expiresAt, otp } = e[0];
          if (expiresAt < new Date()) {
            await OTP.deleteMany({
              user_id: id,
            });
            res.status(200).send({
              status: false,
              message: "OTP Expired",
            });
          } else {
            if (otp_code === otp) {
              await OTP.deleteMany({
                user_id: id,
              });
              await Member.findOne({
                email: e[0].email,
              }).then((member) => {
                member.active = true;
                member.expiredAt = new Date(new Date().getTime() + 3600000);
                member.save().then(() => {
                  let token = new Buffer(
                    JSON.stringify({
                      id: member._id,
                      email: member.email,
                    })
                  ).toString("base64");
                  res.setHeader("Set-Cookie", [
                    `connect.u3/i(=${token}; HttpOnly; Max-Age=36000000;`,
                  ]);

                  res.status(200).send({
                    message: "OTP Verified",
                    success: true,
                    data: {
                      id: member._id,
                      email: member.email,
                    },
                  });
                });
              });
            } else {
              res.status(200).send({
                status: false,
                message: "Invalid OTP",
              });
            }
          }
        }
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Something Unexpected happened",
    });
  }
};

const ClientPostResendOTP = async (req, res, next) => {
  const { id, email } = req.body;
  try {
    if (id === undefined || email === undefined) {
      throw Error("Invalid Credentials");
    }
    await OTP.deleteMany({
      user_id: id,
    }).then(async () => {
      await Member.findOne({ email }).then(async (member) => {
        if (member !== null) {
          const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

          const options = {
            from: process.env.AUTH_MAIL_USER_ID,
            to: email,
            subject: "OTP for Login",
            html: `<div>
            <p>
              We're happy you're here. This is your OTP, type it and fill the form
            </p>
            <div>
              <h1>${otp}</h1>
            </div>
            <div>
              Hurry up !, this OTP will expire in 1 hour
            </div>
          </div>`,
          };
          const otpModel = new OTP({
            user_id: member._id,
            email: email,
            otp: otp,
            createdAt: new Date(),
            expiresAt: new Date(new Date().getTime() + 3600000),
          });
          otpModel.save();
          transporter.sendMail(options, function (error, info) {
            if (error) {
            } else {
            }
          });
          res.status(200).send({
            message: "OTP Sent",
            success: true,
            userid: member._id,
            email: member.email,
          });
        } else {
          res.status(200).send({
            status: false,
            message: "Email Not Found",
          });
        }
      });
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const ClientPostLogout = async (req, res, next) => {
  const { id } = req.body;
  try {
    if (id === undefined) {
      throw Error("Invalid Credentials");
    }
    await Member.findById({
      _id: id,
    }).then((member) => {
      if (member !== null) {
        member.active = false;
        member.save().then(() => {
          res.status(200).send({
            message: "Logged Out",
            success: true,
          });
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Logged Out",
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const ClientGetDashboard = async (req, res, next) => {
  try {
    // console.log(req.userid);
    await Member.findById(req.userid).then(async (member) => {
      if (member) {
        const user_member = await User.findById(member.ParentId)
          .populate({
            model: "Template",
            path: "template",
            options: { sort: { isActive: -1 } },
          })
          .exec();
        const temp = user_member.template
          ?.filter((e) => {
            return (
              e.isComplete === false &&
              e.isAccepting === true &&
              Object.keys(e.handle.role).includes(req.email)
            );
          })
          .map((e, i) => {
            return {
              name: e.name,
              id: e._id,
              createdAt: e.createdAt,
            };
          });
        res.status(200).send({
          message: "Success",
          success: true,
          template: temp,
        });
      } else {
        throw Error("Something Unexpected happened !");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const ClientPostDashboard = async (req, res, next) => {
  try {
    const { templateid } = req.body;
    await Template.findById(templateid).then((t) => {
      if (t) {
        const limits = t.handle.role[req.email];
        const layout = t.layout.slice(limits[0], limits[1]);
        const range = Array(limits[1] - limits[0] + 1)
          .fill()
          .map((_, idx) => limits[0] + idx);

        const template = {
          layout: layout.map((e, i) => {
            return {
              ...e,
              index: range[i],
            };
          }),
          name: t.name,
        };
        res.status(200).send({
          message: "Success",
          success: true,
          template: template,
        });
      } else {
        throw new Error("Something Went Wrong !");
      }
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const ClientPostUploadFile = async (req, res, next) => {
  try {
    var { templateid, index, file_type, webLink } = JSON.parse(req.body.misc);
    if (file_type !== "web") {
      var type = "";

      if (!req.files) {
        throw new Error("No file uploaded");
      } else {
        if (
          req.files.file.mimetype.startsWith("image/") ||
          req.files.file.mimetype.endsWith("jpeg") ||
          req.files.file.mimetype.endsWith("jpg") ||
          req.files.file.mimetype.endsWith("png")
        ) {
          if (req.files.file.size > 1000000) {
            throw new Error("File size is too large");
          }
          type = "image";
        }
        //check fot text file
        else if (
          req.files.file.mimetype.startsWith("text/") ||
          req.files.file.mimetype.endsWith("plain")
        ) {
          if (req.files.file.size > 500000) {
            throw new Error("File size is too large");
          }
          type = "text";
        }
        //check for pdf file
        else if (req.files.file.mimetype.startsWith("application/pdf")) {
          if (req.files.file.size > 10000000) {
            throw new Error("File size is too large");
          }
          type = "pdf";
        }
        //check for excel file
        else if (
          req.files.file.mimetype.startsWith("application/vnd.ms-excel") ||
          req.files.file.mimetype.startsWith(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
        ) {
          if (req.files.file.size > 1000000) {
            throw new Error("File size is too large");
          }
          type = "excel";
        } else {
          throw new Error("Invalid File Type");
        }

        await Template.findById(templateid).then((t) => {
          if (t) {
            if (fs.existsSync(t.handle.publish[index][type].path)) {
              fs.unlinkSync(t.handle.publish[index][type].path);
            }
            const file = req.files.file;
            const file_name = `${uuidv4()}.${file.name.split(".").pop()}`;
            const path = `./uploads/${file_name}`;
            file.mv(path, async (err) => {
              if (err) {
                throw new Error("something went wrong !");
              } else {
                if (t) {
                  t.handle.publish[index][type] = {
                    path: path,
                    file_name: file_name,
                    name: file.name,
                  };
                  t.markModified("handle.publish");
                  t.save().then((t) => {
                    res.status(200).send({
                      message: "File Uploaded Successfully",
                      success: true,
                    });
                  });
                } else {
                  throw new Error("Something Went Wrong !");
                }
              }
            });
          }
        });
      }
    } else {
      await Template.findById(templateid).then((t) => {
        t.handle.publish[index][file_type] = {
          web: webLink,
        };
        t.markModified("handle.publish");
        t.save().then((t) => {
          res.status(200).send({
            message: "Web Link Updated Successfully",
            success: true,
          });
        });
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const ClientGetDownloadFile = async (req, res, next) => {
  try {
    const { templateid, index, type } = req.query;
    await Template.findById(templateid).then((t) => {
      if (t) {
        const file = t.handle.publish[index][type];
        if (fs.existsSync(file.path)) {
          res.sendFile(
            file.file_name,
            {
              headers: {
                "Content-Disposition": `attachment; ${file.file_name}`,
              },
              root: "./uploads/",
            },
            (err) => {
              if (err) {
                next(err);
              } else {
              }
            }
          );
        } else {
          throw new Error("File Not Found");
        }
      } else {
        throw new Error("Something Went Wrong !");
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const ClientPostFileInfo = async (req, res, next) => {
  try {
    const { templateid, index, file_type } = req.body;

    await Template.findById(templateid).then((t) => {
      if (t) {
        if (file_type === "web") {
          file_name = t.handle.publish[index][file_type].web;
        } else {
          file_name = t.handle.publish[index][file_type].name;
        }
        res.status(200).send({
          message: "Success",
          success: true,
          file: file_name ? file_name : "",
        });
      } else {
        throw new Error("Something Went Wrong !");
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const AdminPostDashboardView = async (req, res, next) => {
  try {
    const { templateid } = req.body;
    await Template.findById(templateid).then((t) => {
      if (t) {
        res.status(200).send({
          message: "Success",
          success: true,
          template: {
            layout: t.layout,
            name: t.name,
          },
        });
      } else {
        throw new Error("Something Went Wrong !");
      }
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const AdminPostFileInfo = async (req, res, next) => {
  try {
    const { templateid, index } = req.body;
    await Template.findById(templateid).then((t) => {
      if (t) {
        res.status(200).send({
          message: "Success",
          success: true,
          file: t.layout[index]?.data,
        });
      } else {
        throw new Error("Something Went Wrong !");
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const AdminPostUploadFile = async (req, res, next) => {
  try {
    var { templateid, index } = JSON.parse(req.body.misc);
    var type = "";

    if (!req.files) {
      throw new Error("No file uploaded");
    } else {
      if (
        req.files.file.mimetype.startsWith("image/") ||
        req.files.file.mimetype.endsWith("jpeg") ||
        req.files.file.mimetype.endsWith("jpg") ||
        req.files.file.mimetype.endsWith("png")
      ) {
        if (req.files.file.size > 1000000) {
          throw new Error("File size is too large");
        }
        type = "image";
      }
      //check fot text file
      else if (
        req.files.file.mimetype.startsWith("text/") ||
        req.files.file.mimetype.endsWith("plain")
      ) {
        if (req.files.file.size > 500000) {
          throw new Error("File size is too large");
        }
        type = "text";
      }
      //check for pdf file
      else if (req.files.file.mimetype.startsWith("application/pdf")) {
        if (req.files.file.size > 10000000) {
          throw new Error("File size is too large");
        }
        type = "pdf";
      }
      //check for excel file
      else if (
        req.files.file.mimetype.startsWith("application/vnd.ms-excel") ||
        req.files.file.mimetype.startsWith(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ) {
        if (req.files.file.size > 1000000) {
          throw new Error("File size is too large");
        }
        type = "excel";
      } else {
        throw new Error("Invalid File Type");
      }

      await Template.findById(templateid).then((t) => {
        if (t) {
          const file = req.files.file;
          const file_name = `${uuidv4()}.${file.name.split(".").pop()}`;
          const path = `./uploads/${file_name}`;
          file.mv(path, async (err) => {
            if (err) {
              throw new Error("something went wrong !");
            } else {
              // if (t) {
              t.layout[index].data = [
                ...(t.layout[index].data === null ? [] : t.layout[index].data),
                {
                  path: path,
                  file_name: file_name,
                  name: file.name,
                },
              ];
              t.markModified("layout");
              t.save().then((t) => {
                res.status(200).send({
                  message: "File Uploaded Successfully",
                  success: true,
                });
              });
            }
          });
        }
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const AdminDeleteForm = async (req, res, next) => {
  try {
    const { id } = req.body;

    await Template.findById(id).then((m) => {
      if (m) {
        for (i of Object.values(m.layout)) {
          if (i.data !== null) {
            for (j of i.data) {
              fs.unlink(j.path, (err) => {
                if (err) {
                }
              });
            }
          }
        }
        Template.findByIdAndDelete(id).then((t) => {
          User.findById({ _id: req.user._id }).then((user) => {
            let tmp = user.template;
            let index = tmp.indexOf(id);
            user.template = [...tmp.slice(0, index), ...tmp.slice(index + 1)];
            user.markModified("template");
            user.save().then(() => {
              res.status(200).send({
                message: "Success",
                success: true,
              });
            });
          });
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const AdminCompletePostForm = async (req, res, next) => {
  try {
    const { id, v } = req.body;

    await Template.findById(id).then((t) => {
      if (t) {
        t.isComplete = v;
        t.save().then((t) => {
          res.status(200).send({
            message: "Success",
            success: true,
          });
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const AdminAcceptingPostForm = async (req, res, next) => {
  try {
    const { id, v } = req.body;

    await Template.findById(id).then((t) => {
      if (t) {
        t.isAccepting = v;
        t.save().then((t) => {
          res.status(200).send({
            message: "Success",
            success: true,
          });
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const AdminCompleteGetForm = async (req, res, next) => {
  try {
    const { id } = req.query;
    await Template.findById(id).then((t) => {
      if (t) {
        res.status(200).send({
          check: t.isComplete,
          accept: t.isAccepting,
          success: true,
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const AdminClientPostDeleteFile = async (req, res, next) => {
  try {
    const { index, fileIndex, templateid, path } = req.body;

    await Template.findById(templateid).then((t) => {
      if (t) {
        console.log(path);
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
        t.layout[index].data = [
          ...t.layout[index].data.slice(0, fileIndex),
          ...t.layout[index].data.slice(fileIndex + 1),
        ];
        t.markModified("layout");
        t.save().then((t) => {
          res.status(200).send({
            message: "File Deleted",
            success: true,
          });
        });
      } else {
        throw new Error("Something went wrong");
      }
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

//version2 updates
const AdminTemplateAddSection = async (req, res, next) => {
  try {
    const { index, templateName, id } = req.body;
    Template.findById(id).then((t) => {
      if (t) {
        t.layout.push({
          title: "",
          type: "section",
          parent: null,
          level: 0,
          data: [],
          keyword: null,
        });
        t.save().then((t) => {
          res.status(200).send({
            message: "Section Added",
            success: true,
          });
        });
      } else {
        throw new Error("Something went wrong");
      }
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const AdminTemplateAddChild = async (req, res, next) => {
  try {
    const { index, id, level } = req.body;
    Template.findById(id).then((t) => {
      if (t) {
        var i = index + 1;
        for (i; i < t.layout.length; i++) {
          if (t.layout[i].level < level || t.layout[i].level === level) {
            break;
          }
        }
        t.layout = [
          ...t.layout.slice(0, i),
          {
            title: "",
            type: "item",
            parent: index,
            level: level + 1,
            data: [],
          },
          ...t.layout.slice(i),
        ];
        t.save().then((t) => {
          res.status(200).send({
            message: "Child Added",
            success: true,
          });
        });
      } else {
        throw new Error("Something went wrong");
      }
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const AdminTemplateUpdateChild = async (req, res, next) => {
  try {
    const { index, id, data } = req.body;
    Template.findById(id).then((t) => {
      if (t) {
        if (t.layout[index].type === "item" && data.type === "section") {
          for (k of t.layout[index].data) {
            if (fs.existsSync(k.path)) {
              fs.unlinkSync(k.path);
            } else {
              throw new Error("Something went wrong !");
            }
          }
        }
        t.layout[index] = data;
        t.save().then((t) => {
          res.status(200).send({
            message: "Child Updated",
            success: true,
          });
        });
      } else {
        throw new Error("Something went wrong");
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const AdminTemplateDeleteChild = async (req, res, next) => {
  try {
    const { id, index, level } = req.body;
    Template.findById(id).then((t) => {
      if (t) {
        var i = index + 1;
        if (t.layout[i].type === "section") {
          for (i; i < t.layout.length; i++) {
            if (t.layout[i].type === "item") {
              console.log(t.layout[i].data);
              if (t.layout[i].data?.length > 0) {
                for (k of t.layout[i].data) {
                  console.log(k);
                  if (fs.existsSync(k.path)) {
                    fs.unlinkSync(k.path);
                  } else {
                    throw new Error("Something went wrong !");
                  }
                }
              }
              t.layout[i].data = [];
            }

            if (t.layout[i].level < level || t.layout[i].level === level) {
              break;
            }
          }
        } else {
          for (k of t.layout[index].data) {
            if (fs.existsSync(k.path)) {
              fs.unlinkSync(k.path);
            } else {
              throw new Error("Something went wrong !");
            }
          }
          t.layout[i].data = [];
        }
        t.layout = [...t.layout.slice(0, index), ...t.layout.slice(i)];
        t.save().then((t) => {
          res.status(200).send({
            message: "Child Deleted",
            success: true,
          });
        });
      } else {
        throw new Error("Something went wrong");
      }
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const AdminPostDownloadFileInfo = async (req, res, next) => {
  try {
    var { templateid, index, file } = req.query;
    file = JSON.parse(file);
    await Template.findById(templateid).then((t) => {
      if (t) {
        if (fs.existsSync(file.path)) {
          res.sendFile(
            file.file_name,
            {
              headers: {
                "Content-Disposition": `attachment; ${file.file_name}`,
              },
              root: "./uploads/",
            },
            (err) => {
              if (err) {
                next(err);
              } else {
              }
            }
          );
        } else {
          throw new Error("File Not Found");
        }
      } else {
        throw new Error("Something Went Wrong !");
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const AdminPostKeyword = async (req, res, next) => {
  try {
    const { keyword } = req.body;

    User.findById(req.user.id).then((t) => {
      if (t) {
        if (!t.keywords.includes(keyword)) {
          t.keywords.push(keyword);
          t.markModified("keywords");
          t.save().then((t) => {
            res.status(200).send({
              message: "Keyword Updated",
              success: true,
            });
          });
        } else {
          res.status(200).send({
            message: "Keyword Already Exists",
            success: true,
          });
        }
      } else {
        throw new Error("Something went wrong");
      }
    });
  } catch (err) {
    res.status(503).send({
      success: false,
      message: err.message,
    });
  }
};

const AdmingetKeyword = async (req, res, next) => {
  try {
    const { id, index } = req.query;
    await User.findById(req.user.id).then(async (t) => {
      if (t) {
        if (t.keywords) {
          let KEYWORDS = t.keywords;
          await Template.findById(id).then((temp) => {
            if (temp) {
              for (i of temp.layout) {
                if (i.type === "section" && i.level === 0 && i.keyword) {
                  if (KEYWORDS.includes(i.keyword)) {
                    KEYWORDS = [...KEYWORDS.filter((k) => k !== i.keyword)];
                  }
                }
              }
              res.status(200).send({
                keywords: KEYWORDS,
                key: temp.layout[index].keyword,
                success: true,
              });
            } else {
              res.status(200).send({
                keywords: KEYWORDS,
                success: true,
                // key: temp.layout[index].keyword,
              });
            }
          });
        } else {
          throw new Error("Something went wrong");
        }
      } else {
        throw new Error("Something went wrong");
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const AdminDeleteKeyword = async (req, res, next) => {
  try {
    const { keyword } = req.body;
    User.findById(req.user.id).then((t) => {
      if (t) {
        if (t.keywords.includes(keyword)) {
          t.keywords = t.keywords.filter((k) => k !== keyword);
          t.markModified("keywords");

          for (id of t.template) {
            Template.findById(id).then((t) => {
              if (t) {
                for (j in t.layout) {
                  if (
                    t.layout[j].level === 0 &&
                    t.layout[j].type === "section" &&
                    t.layout[j].keyword !== null
                  ) {
                    t.layout[j].keyword = null;
                    break;
                  }
                }
                t.markModified("layout");
                t.save();
              }
            });
          }
          t.save().then((t) => {
            res.status(200).send({
              message: "Keyword Deleted",
              success: true,
            });
          });
        } else {
          throw new Error("Keyword Not Found");
        }
      } else {
        throw new Error("Something went wrong");
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const AdminPutKeyword = async (req, res, next) => {
  try {
    const { id, index, keyword } = req.body;
    Template.findById(id).then((t) => {
      if (t) {
        t.layout[index].keyword = keyword;
        t.markModified("layout");
        t.save().then((t) => {
          res.status(200).send({
            message: "Keyword Updated",
            success: true,
          });
        });
      } else {
        throw new Error("Something went wrong");
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const AdminUpdateFormName = async (req, res, next) => {
  try {
    const { id, name } = req.body;
    Template.findById(id).then((t) => {
      if (t) {
        t.name = name;
        t.save().then((t) => {
          res.status(200).send({
            message: "Form Name Updated",
            success: true,
          });
        });
      } else {
        throw new Error("Something went wrong");
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const PublicGetAllTemplate = async (req, res, next) => {
  try {
    await User.findOne({ role: "ADMIN" }).then(async (user) => {
      if (user) {
        var TEMPLATE = [];
        for (id of user.template) {
          await Template.findById(id).then((t) => {
            if (t) {
              TEMPLATE.push(t);
            }
          });
        }
        TEMPLATE = TEMPLATE.filter(
          (t) => t.isComplete === true && t.isAccepting === false
        );
        TEMPLATE = TEMPLATE.map((t) => {
          return {
            id: t._id,
            name: t.name,
            layout: t.layout,
          };
        });
        res.status(200).send({
          success: true,
          templates: TEMPLATE,
          keywords: user.keywords,
        });
      } else {
        throw new Error("Something went wrong");
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const PublicGetImage = async (req, res, next) => {
  try {
    const file = req.url.split("/").pop();
    const contentType = `image/${path.extname(file).slice(1)}`;
    res.writeHead(200, {
      "Content-Type": contentType,
    });
    fs.readFile(`./uploads/${file}`, function (err, content) {
      // Serving the image
      res.end(content);
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const PublicDownloadFile = async (req, res, next) => {
  try {
    const { id, file_name } = req.query;
    Template.findById(id).then((t) => {
      if (t) {
        if (t.isComplete === true && t.isAccepting === false) {
          if (fs.existsSync(`./uploads/${file_name}`)) {
            res.sendFile(
              file_name,
              {
                headers: {
                  "Content-Disposition": `attachment; ${file_name}`,
                },
                root: "./uploads/",
              },
              (err) => {
                if (err) {
                  next(err);
                } else {
                }
              }
            );
          } else {
            throw new Error("File Not Found");
          }
        } else {
          throw new Error("Something went wrong !");
        }
      } else {
        throw new Error("Something went wrong !");
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
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
  AdminDeleteUser,
  AdminGetUser,
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
  PublicDownloadFile,
};
