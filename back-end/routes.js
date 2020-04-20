const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const md5 = require('md5');
var cache = require('./memoryCache');

var authenticate = function(req,res,next){
    try {
        jwt.verify(req.headers.authorization,"s3nh453Cr3T4d4Ap1");
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({"Message":"Autenticação Falhou"});
    }
};

router.get('/', (req,res) => {
  res.status(200).json({"Message":"Funcionando"});
})

router.get ('/all-users', (req,res) => {
  res.status(200).json(cache.get("users"));
});

router.post('/new-user', (req,res) => {
    var valid = true;
    if(req.body.tos === false){
        res.status(400).json({"Message":"Você precisa aceitar os termos de uso para se cadastrar"});
        valid = false;
    }
    // TODO validar se todos os campos existem, se o front-end mandou a mensagem com os parâmetros corretos
    var new_user = req.body;

    new_user.login = new_user.login.toLowerCase();
    new_user.email = new_user.email.toLowerCase();

    //TODO verificação regex email
    // Como fazer isso >
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript

    var all_users = cache.get("users");
    if (all_users !== undefined) {
        for (var i = 0; i < all_users.length; i++) {
            if(all_users[i].login === new_user.login){
                res.status(400).json({"Message":"Este nome de usuário já está em uso"});
                valid = false;
                break;
            }
            if(all_users[i].email === new_user.email){
                res.status(400).json({"Message":"Este email já está em uso"});
                valid = false;
                break;
            }
        }
    }

    if (valid) {
      new_user.password = md5(new_user.password);
      console.log(new_user);
      db.register_user(new_user);
      res.status(200).json({"Message":"Usuário criado com sucesso!"});
    }

});

router.post('/login', (req,res) => {
    var this_user = cache.get("users").filter((user) => {
        return user.login === req.body.login.toLowerCase();
    })[0];

    if (this_user){
      var valid = (this_user.password === md5(req.body.password));
      if (valid) {
          var response_json = {
              "id":this_user._id,
              "email":this_user.email,
              "nome":this_user.nome,
              "isProfessional":this_user.isProfessional,
              "informacaoProfissional": this_user.informacaoProfissional,
              "mensagens":this_user.mensagens,
              "avaliacoes":this_user.avaliacoes,
              "tags": this_user.tags,
              "localidade": this_user.localidade
          };

          console.log(response_json);

          var token = jwt.sign(response_json, "s3nh453Cr3T4d4Ap1", {"expiresIn": "1h"});
          res.status(200).json({
              "Message":"Login efetuado com sucesso!",
              "Token": token
          });
      }else {
          res.status(401).json({"Message":"As credenciais de login são inválidas"})
      }
    }
    else {
        res.status(401).json({"Message":"As credenciais de login são inválidas"})
    }

});

//Alterar o objeto usuário

router.post('/update-user/:id', async(req,res) => {

  let req_user = req.body;

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


//Upload de fotos de usuários

const storagePng = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'users/photos')
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
});

const uploadImg = multer({ storage: storagePng });

router.post('/upload/profilepic', uploadImg.single('file'), (req, res) => {
  console.log(req.file);

    res.json({"response": res.req.file.filename});
    if(req.body){
        res.json();
    }else throw 'errou'

});

router.post('/search', (req,res) => {

  let users = cache.get("users");

  let search_parameters = {
    "tags":[],
    "estado":"",
    "cidade":""
  }

  if(req.body.tags){
    search_parameters.tags = req.body.tags;
  }

  if(req.body.estado){
    search_parameters.estado = req.body.estado;
  }

  if(req.body.cidade){
    search_parameters.cidade = req.body.cidade;
  }


  let search_response = [];

  search_response = users.filter((user_obj) => {


    if (user_obj.isProfessional !== true){
      return false;
    }

    if(user_obj.localidade.estado !== search_parameters.estado){
      if (search_parameters.estado !== ""){
        return false;
      }
    }

    if (user_obj.localidade.cidade !== search_parameters.cidade){
      if (search_parameters.cidade !== ""){
        return false;
      }
    }

    for (var i = 0; i < search_parameters.tags.length; i++) {

      let has_tag = false;

      for (var i2 = 0; i2 < user_obj.tags.length; i2++) {

        if (search_parameters.tags[i].toLowerCase() === user_obj.tags[i2].toLowerCase()){
          has_tag = true;
        }
      }

      if (!has_tag){
        return false;
      }
    }


    return true;
  });

  let to_send = [];

  for (var i = 0; i < search_response.length; i++) {
    to_send.push({
      "_id":search_response[i]._id,
      "nome": search_response[i].nome,
      "ocupacao":search_response[i].informacaoProfissional.ocupacao,
      "tratar":search_response[i].informacaoProfissional.tratarCondicoes,
      "sobre":search_response[i].informacaoProfissional.sobre,
      "estado":search_response[i].localidade.estado,
      "cidade":search_response[i].localidade.cidade
    });
  }

  let response = {
    "user_list": to_send
  };

  res.status(200).json(response);
});


module.exports = router;
