var Member = require("../models/member");

async function AuthenticateClient(req, res, next) {

  try {
    const userid = req.cookies["connect.u3/i("];
    const token = JSON.parse(new Buffer(userid, "base64").toString("ascii"));

    if (userid) {
      await Member.findById(token.id).then(async (user) => {
        if (user) {
          if (user.isActive == true && user.expiredAt > Date.now()) {
            throw new Error("Try Again, Your Session is Expired !!!");
          } else {
            req.userid = user._id;
            req.email = user.email;
            next();
          }
        } else {
          user.isActive = false;
          await user.save().then(() => {
            throw new Error("Something went Wrong !!!");
          });
        }
      });
    }
    else{
      throw new Error("Try Again, Your Session is Expired !!!");
    }
  } catch (err) {
    res.setHeader("set-cookie", "connect.u3/i(=;");
    res.status(200).send({
      status: false,
      message: err.message,
    });
  }
}

module.exports = {
  AuthenticateClient,
};
