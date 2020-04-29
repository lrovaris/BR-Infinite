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
  res.status(200).json({"Message":"Funcionando"});
});

router.post('/login', async(req,res) => {

  console.log(req.body);

  let all_users = await controller.get_users();

  if(all_users.length === 0){
    res.status(503).json({"Message":"Servidor inicializando"});
    return;
  }

  let this_user = all_users.filter((user) => {
      return user.login === req.body.login.toLowerCase();
  })[0];

  if (this_user){
    let valid = false;

    valid = (this_user.active)

    if(valid){

      valid = (this_user.password === md5(req.body.password));

      if (valid) {
        let response_json = {
          "id":this_user._id,
          "nome":this_user.nome,
          "admin": this_user.admin,
          "login": this_user.login
        };

        let token = jwt.sign(response_json, "s3nh453Cr3T4d4Ap1", {"expiresIn": "1h"});
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

router.use(auth);

router.get ('/all', async (req,res) => {
  let all_users = await controller.get_users();

  res.status(200).json(all_users);
});

router.post('/new', async(req,res) => {
    var valid = true;

    var new_user = req.body;

    if (!new_user.login){
      res.status(400).json({"Message":"Campo de login vazio"});
      valid = false;
    }

    if (!new_user.password){
      res.status(400).json({"Message":"Campo de senha vazio"});
      valid = false;
    }

    if (!new_user.name){
      res.status(400).json({"Message":"Campo de nome vazio"});
      valid = false;
    }

    if (!new_user.admin){
      new_user['admin'] = false;
    }

    new_user['active'] = true;

    new_user.login = new_user.login.toLowerCase();

    var all_users = cache.get("users");

    if (all_users !== undefined) {
        for (var i = 0; i < all_users.length; i++) {
            if(all_users[i].login === new_user.login){
                res.status(400).json({"Message":"Este nome de usuário já está em uso"});
                valid = false;
                break;
            }
        }
    }

    if (valid) {
      new_user.password = md5(new_user.password);
      logger.log(new_user);
      await db.register_user(new_user).catch(err => logger.error(err));
      res.status(200).json({"Message":"Usuário criado com sucesso!"});
    }
});


//Alterar o objeto usuário

router.post('/:id/edit', async(req,res) => {

  let req_user = req.body;

  req_user['_id'] = req.params.id;

  let db_user = cache.get("users").filter((user_obj) => {
      return user_obj._id == req_user._id;
  })[0];

  Object.keys(req_user).forEach(function(key) {
    let val = req_user[key];
    if(key === "password"){
      db_user[key] = md5(val);
    }else {
      db_user[key] = val;
    }
  });

  let edited_user = await db.update_user(db_user).catch(err => logger.error(err));

  await res.json(edited_user);
});

module.exports = router;
