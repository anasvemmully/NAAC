const Template = require("../models/template");
const User = require("../models/users");
const fs = require("fs");

// const index1 = async (req, res, next) => {
//   try {
//     await Template.findById(req.params.templateId).then((template) => {
//       console.log(template.handle);
//       if (template) {
//         if (
//           template.isComplete &&
//           template.islive === true &&
//           template.isActive === false
//         )
//           res.render("index", { template: template });
//       } else {
//         res.render("index", { template: template });
//       }
//     });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// const DownloadFile = async (req, res, next) => {
//   try {
//     const { file, templateid } = req.body;

//     await Template.findById(templateid).then((template) => {
//       if (template) {
//         if (
//           template.isComplete &&
//           template.islive === true &&
//           template.isActive === false
//         ) {
//           if (fs.existsSync(file.path)) {
//             res.sendFile(
//               file.file_name,
//               {
//                 headers: {
//                   "Content-Disposition": `attachment; ${file.file_name}`,
//                 },
//                 root: "./uploads/",
//               },
//               (err) => {
//                 if (err) {
//                   next(err);
//                 } else {
//                   console.log("Sent:", file.file_name);
//                 }
//               }
//             );
//           }
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

const PublicGetAllTemplate = async (req, res, next) => {
  try {
    User.findOne({ role: "ADMIN" }).then((user) => {
      console.log(user.templates);
      console.log("user.templates");
      res.status(200).send({
        message: "All Templates",
        data: user.templates,
      });
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  // index1,
  // DownloadFile,
  PublicGetAllTemplate,
};
