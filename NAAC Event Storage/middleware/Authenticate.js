function AuthenticateAdmin(req,res,next){
    console.log("Authenticaation Middleware working fine");
    if(req.isAuthenticated() && req.user.role === "ADMIN"){
        next();
    }
    else{
        res.status(403).send({
            message : "You are not authorized to access this page", 
            isAuthenticated : req.isAuthenticated()
        });
        res.redirect('http://localhost:3000/admin/');
    }
}

module.exports  = {
    AuthenticateAdmin
}