const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
var cache = require('../memoryCache');


router.get ('/', (req,res) => {
  res.status(200).json({"Message":"Funcionando"});
});


router.get ('/all', async (req,res) => {
  let all_users = cache.get("users");

  if (all_users !== undefined){
      res.status(200).json(cache.get("users"));
  }

  else {
    all_users = await db.get_users();

    res.status(200).json(cache.get("users"));
  }
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
      console.log(new_user);
      await db.register_user(new_user).catch(err => console.error(err));
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
    db_user[key] = val;
  });

  let edited_user = await db.update_user(db_user).catch(err => console.error(err));

  await res.json(edited_user);
});

module.exports = router;
