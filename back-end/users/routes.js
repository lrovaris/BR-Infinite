const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const db = require('./db');
const controller = require('./controller');
const auth = require('./utils').authenticate;
const cache = require('../memoryCache');
const logger = require('../logger');

router.get ('/', (req,res) => {
  res.status(200).json({"message":"Funcionando"});
});

router.post('/login', async(req,res) => {

  let this_user = await controller.get_user_by_login(req.body.login)

  if(!this_user.login){
    return res.status(401).json({"message": "As credenciais de login são inválidas"})
  }

  if (this_user === undefined){
    return res.status(401).json({"message": "As credenciais de login são inválidas"})
  }

  if(!this_user.active){
    return res.status(401).json({"message":"Este usuário está invativo"})
  }

  if(!this_user.password === md5(req.body.password)){
    return res.status(401).json({"message":"As credenciais de login são inválidas"});
  }

  let response_json = {
    "id":this_user._id,
    "nome":this_user.nome,
    "admin": this_user.admin,
    "login": this_user.login
  };

  let token = jwt.sign(response_json, "s3nh453Cr3T4d4Ap1", {"expiresIn": "1h"});
  res.status(200).json({
    "message":"Login efetuado com sucesso!",
    "token": token
  });

});

router.use(auth);

router.get ('/all', async (req,res) => {
  let all_users = await controller.get_users();

  res.status(200).json(all_users);
});

router.post('/new', async(req,res) => {
    var new_user = req.body;

    if (!new_user.login){
      return res.status(400).json({"message":"Campo de login vazio"});
    }

    if (!new_user.password){
      return res.status(400).json({"message":"Campo de senha vazio"});
    }

    if (!new_user.name){
      return res.status(400).json({"message":"Campo de nome vazio"});
    }

    if (!new_user.admin){
      new_user['admin'] = false;
    }

    new_user['active'] = true;

    new_user.login = new_user.login.toLowerCase();

    if(await controller.get_user_by_login(new_user.login) !== undefined){
      return res.status(400).json({"message":"Este nome de usuário já está em uso"});
    }

    new_user.password = md5(new_user.password);

    logger.log(new_user);

    await db.register_user(new_user).catch(err => logger.error(err));

    res.status(200).json({"message":"Usuário criado com sucesso!"});
});


//Alterar o objeto usuário

router.post('/:id/edit', async(req,res) => {

  let req_user = req.body;

  db_user = await controller.get_user_by_id(req.params.id);

  if(db_user === undefined){
    return res.status(400).json({"message":"Usuário inválido"})
  }

  Object.keys(req_user).forEach(function(key) {
    let val = req_user[key];
    if(key === "password"){
      db_user[key] = md5(val);
    }else {
      db_user[key] = val;
    }
  });

  let edited_user = await db.update_user(db_user).catch(err => logger.error(err));

  res.status(200).json(edited_user);
});

module.exports = router;
