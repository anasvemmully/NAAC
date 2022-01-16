
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var bcrypt = require('bcrypt');
module.exports = (passport)=>{
    passport.use( new LocalStrategy(
        ( username , password , done )=>{
          User.findOne({ username : username }, function (err, user) {
            if (err) { return done(err); }
            else if (!user) {
              return done(null, false, { message: 'Invalid Credentials.' });
            }
            bcrypt.compare(password, user.password, function(err, res) {
              if(res == true){
                return done(null, user);
              }
              else{
                return done(null, false, { message: 'Invalid Credentials.' });
              }
            });
          });
        }
    ));

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user);
      });
    });
};


// const LocalStrategy =require('passport-local').Strategy
// const bcrypt = require('bcrypt')
// const User = require("./models/User")

// module.exports = function initialize(passport,getUserbyUsername){

//     const Authenticate_user = async (username,password,done)=>{
//         const user =await getUserbyUsername(username)
//         if(user == null){
//             return done(null,false,{message : "Incorreect Username"})
//         }
//         bcrypt.compare(password,user.password,(err,resbool)=>{
//             if(err) return done(err)
//             if(resbool==false) return done(null,false,{ message: "Incorrect Password" })
//             return done(null,user)
//         })
//     }

//     passport.use(new LocalStrategy(
//         // {usernameField : 'username'},
//         Authenticate_user))

//     passport.serializeUser((user,done)=>{
//         done(null,user.id)
//     })
//     passport.deserializeUser((id,done)=>{
//         User.findById(id,(err,user)=>{
//             done(err,user)
//         })
//     })
// }