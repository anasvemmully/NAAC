// const User = require("../models/users");
// const Meta = require('../models/meta');
const Template = require("../models/template");
const Member = require("../models/member");
const User = require("../models/users");
const OTP = require("../models/otp");

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
  try {
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

              dict = {};
              template.layout.map((e, index) => {
                if (e.type === "item") {
                  for (i in e.data) {
                    if (e.data[i] === true) {
                      if (dict[index]) {
                        dict[index][i] = {};
                      } else {
                        dict[index] = {
                          [i]: {},
                        };
                      }
                    }
                  }
                }
              });

              template.handle.publish = dict;
              template.handle.role = {};
              template.handle.indexRole = {};

              template.save().then((template) => {
                res.status(200).send({
                  message: "Template Updated",
                });
              });
            }
          })
          .catch((err) => {
            console.log(err);
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

const AdminGetUser = async (req, res, next) => {
  try {
    await Member.find({}).then((members) => {
      console.log("members");
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
        res.status(500).send({
          success: false,
        });
      });
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const AdminDeleteUser = async (req, res, next) => {
  try {
    const { email, template_id } = req.body;

    await Member.findOneAndDelete({
      email: email,
    }).then(async (member) => {
      await Template.findById({
        _id: template_id,
      })
        .then((template) => {
          const temp = template.handle.role;
          if (Object.keys(template.handle.role).includes(email)) {
            const index = temp[email][0];
            const expand =
              template.handle.indexRole[index] === undefined
                ? []
                : template.handle.indexRole[index].filter((e) => e !== email);
            template.handle.indexRole = {
              ...template.handle.indexRole,
              [index]: [...expand],
            };
            delete temp[email];
          }
          template.handle.role = { ...temp };
          template.markModified("handle.role");

          template.save().then(() => {
            res.status(200).send({
              message: "User Deleted",
              success: true,
            });
          });
        })
        .catch((err) => {
          throw new Error("Internal Server Error");
        });
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
      if (Object.keys(template.handle.role).includes(email)) {
        res.status(200).send({
          message: "User Already Exists",
        });
      } else {
        template.handle.role = {
          ...template.handle.role,
          [email]: [start, end],
        };

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
      message: "Internal Server Error",
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
      message: error.message,
      success: false,
    });
  }
};

const ClientPostLogin = async (req, res, next) => {
  //otp generation part and model saving
  const { email } = req.body;

  try {
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
        otpModel.save().then(() => {
          transporter.sendMail(options, function (error, info) {
            if (error) {
              throw new Error("Email sending failed");
            } else {
              console.log("Email sent: " + info.response);
              res.status(200).send({
                message: "OTP Sent",
                success: true,
                userid: member._id,
                email: member.email,
              });
            }
          });
        });
      } else {
        res.status(200).send({
          status: false,
          message: "Email Not Found",
        });
      }
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
            message: "Account record doesn't exist",
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
          otpModel.save().then(() => {
            transporter.sendMail(options, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
            res.status(200).send({
              message: "OTP Sent",
              success: true,
              userid: member._id,
              email: member.email,
            });
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
      member.active = false;
      member.save().then(() => {
        res.status(200).send({
          message: "Logged Out",
          success: true,
        });
      });
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
          ?.filter((e) => !e.isComplete && e.islive)
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
        res.status(200).send({
          message: "Success",
          success: true,
          template: {
            layout: layout.map((e, i) => {
              return {
                ...e,
                index: range[i],
              };
            }),
            name: t.name,
          },
        });
      } else {
        throw new Error("Something Went Wrong !");
      }
    });
  } catch (error) {
    console.log("inside ClientPostDashboard");
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
            console.log("file not existed");
            const file = req.files.file;
            const file_name = `${uuidv4()}.${file.name.split(".").pop()}`;
            const path = `./uploads/${file_name}`;
            console.log(path);
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
                    console.log(t.handle.publish[index][type]);
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
          console.log(t.handle.publish[index][type]);
          res.status(200).send({
            message: "Web Link Updated Successfully",
            success: true,
          });
        });
      });
    }
  } catch (error) {
    console.log(error);
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
                console.log("Sent:", file.file_name);
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
        console.log(t);
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
    console.log("inside ClientPostDashboard");
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const AdminPostFileInfo = async (req, res, next) => {
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

const AdminPostUploadFile = async (req, res, next) => {
  try {
    var { templateid, index, file_type, webLink } = JSON.parse(req.body.misc);
    if (file_type && file_type !== "web") {
      var type = "";
      // console.log("WORKING ON IT!!!");

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
            // console.log(t);
            if (fs.existsSync(t.handle.publish[index][type].path)) {
              fs.unlinkSync(t.handle.publish[index][type].path);
            }
            console.log("file not existed");
            const file = req.files.file;
            const file_name = `${uuidv4()}.${file.name.split(".").pop()}`;
            const path = `./uploads/${file_name}`;
            console.log(path);
            file.mv(path, async (err) => {
              if (err) {
                throw new Error("something went wrong !");
              } else {
                if (t) {
                  console.log(t.handle);
                  t.handle.publish[index][type] = {
                    path: path,
                    file_name: file_name,
                    name: file.name,
                  };
                  t.markModified("handle.publish");
                  t.save().then((t) => {
                    console.log(t.handle.publish[index][type]);
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
          console.log(t.handle.publish[index][type]);
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
};
