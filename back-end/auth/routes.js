const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const md5 = require('md5');
var cache = require('../memoryCache');


router.get('/', (req,res) =>{
  res.status(200).json({"Message":"Funcionando"});
})

router.post('/login', (req,res) => {
    var this_user = cache.get("users").filter((user) => {
        return user.login === req.body.login.toLowerCase();
    })[0];

    if (this_user){
      let valid = false;

      valid = (this_user.active)

      if(valid){

        valid = (this_user.password === md5(req.body.password));

        if (valid) {
          var response_json = {
            "id":this_user._id,
            "nome":this_user.nome,
            "admin": this_user.admin,
            "login": this_user.login
          };

          var token = jwt.sign(response_json, "s3nh453Cr3T4d4Ap1", {"expiresIn": "1h"});
          res.status(200).json({
            "Message":"Login efetuado com sucesso!",
            "Token": token
          });
        }else {
          res.status(401).json({"Message":"As credenciais de login são inválidas"})
        }
      }else {
        res.status(401).json({"Message":"Este usuário está invativo"})
      }
    }
    else {
        res.status(401).json({"Message":"As credenciais de login são inválidas"})
    }

});



module.exports = router;
