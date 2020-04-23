const jwt = require('jsonwebtoken');

var authenticate = function(req,res,next){
  if(global.env == 'prod'){
    try {
        jwt.verify(req.headers.authorization,"s3nh453Cr3T4d4Ap1");
        next();
    } catch (err) {
        //console.log(err);
        res.status(401).json({"Message":"Autenticação Falhou"});
    }
  }

  else {
    next();
  }
};

module.exports = { authenticate };
