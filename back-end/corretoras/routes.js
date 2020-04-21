const express = require('express');
const router = express.Router();
const db = require('./db');
const colaborador_db = require('../colaboradores/db');
var cache = require('../memoryCache');

router.get ('/', (req,res) => {
  res.status(200).json({"Message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_corretoras = cache.get("corretoras");

  if (all_corretoras !== undefined){
      res.status(200).json(cache.get("corretoras"));
  }

  else {
    all_corretoras = await db.get_corretoras();

    res.status(200).json(cache.get("corretoras"));
  }
});

router.post('/new', async(req,res) => {
    let corretora_valid = true;

    let new_corretora = req.body.corretora;

    if(!new_corretora){
      res.status(400).json({"Message":"Corretora inválida"});
      corretora_valid = false;
      return;
    }

    if (!new_corretora.name){
      res.status(400).json({"Message":"Campo de nome da corretora vazio"});
      corretora_valid = false;
      return;
    }

    if (!new_corretora.cnpj){
      res.status(400).json({"Message":"Campo de CNPJ vazio"});
      corretora_valid = false;
      return;
    }

    if (!new_corretora.telephone){
      res.status(400).json({"Message":"Campo de telefone da corretora vazio"});
      corretora_valid = false;
      return;
    }

    if (!new_corretora.email){
      res.status(400).json({"Message":"Campo de email da corretora vazio"});
      corretora_valid = false;
      return;
    }

    if (!new_corretora.address){
      res.status(400).json({"Message":"Campo de endereço vazio"});
      corretora_valid = false;
      return;
    }

    if (!new_corretora.seguradoras){
      res.status(400).json({"Message":"Campo de seguradoras vazio"});
      corretora_valid = false;
      return;
    }

    let corretor_responsavel = req.body.manager;

    let corretor_valid = true;

    if(!corretor_responsavel){
      res.status(400).json({"Message":"Colaborador inválido"});
      corretor_valid = false;
      return;
    }

    if (!corretor_responsavel.name){
      res.status(400).json({"Message":"Campo de nome do colaborador vazio"});
      corretor_valid = false;
      return;
    }

    if (!corretor_responsavel.telephone){
      res.status(400).json({"Message":"Campo de telefone do colaborador vazio"});
      corretor_valid = false;
      return;
    }

    if (!corretor_responsavel.email){
      res.status(400).json({"Message":"Campo de email do colaborador vazio"});
      corretor_valid = false;
      return;
    }

    if (!corretor_responsavel.birthday){
      res.status(400).json({"Message":"Campo de aniversário vazio"});
      corretor_valid = false;
      return;
    }

    if (!corretor_responsavel.job){
      res.status(400).json({"Message":"Campo de cargo vazio"});
      corretor_valid = false;
      return;
    }

    if (corretora_valid && corretor_valid) {
      let new_corr = await db.register_corretora(new_corretora).catch(err => console.error(err));

      console.log(new_corr.insertedId);

      corretor_responsavel.corretora = new_corr.insertedId;

      await colaborador_db.register_colaborador(corretor_responsavel).catch(err => {console.log(err);});

      res.status(200).json({"Message":"Corretora e gerente cadastrados com sucesso!"});
    }
});


//Alterar o objeto da corretora

router.post('/:id/edit', async(req,res) => {

  let req_corretora = req.body;

  req_corretora['_id'] = req.params.id;

  let db_corretora = cache.get("corretoras").filter((corretora_obj) => {
      return corretora_obj._id == req_corretora._id;
  })[0];

  Object.keys(req_corretora).forEach(function(key) {
    let val = req_corretora[key];
    db_corretora[key] = val;
  });

  let edited_corretora = await db.update_corretora(db_corretora).catch(err => console.error(err));

  await res.json(edited_corretora);
});

module.exports = router;
