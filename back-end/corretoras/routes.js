const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger')
const colaborador_db = require('../colaboradores/db');
const controlador_controller = require('../colaboradores/controller');
const controller = require('./controller');

router.get ('/', (req,res) => {
  res.status(200).json({"Message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_corretoras = await controller.get_corretoras();

  res.status(200).json(all_corretoras);
});

router.get('/:id', async(req,res) => {
  let db_corretora = await controller.get_corretora_by_id(req.params.id);

  let manager_id;

  if(db_corretora.manager._id){
    manager_id = db_corretora.manager._id
  }else {
    manager_id = db_corretora.manager
  }

  let colab_info = await controlador_controller.get_colaboradores_corretora(req.params.id, manager_id);

  db_corretora.colaboradores = colab_info.colaboradores;

  db_corretora.manager = colab_info.manager;

  res.status(200).json(db_corretora);
});

router.post('/new', async(req,res) => {

    logger.log(req.body);

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
      let new_corr = await db.register_corretora(new_corretora).catch(err => logger.error(err));

      corretor_responsavel.corretora = new_corr.insertedId;

      let new_colab = await colaborador_db.register_colaborador(corretor_responsavel).catch(err => {logger.log(err);});

      let db_corretora = new_corr.ops[0];

      db_corretora["manager"] = new_colab.insertedId;

      await db.update_corretora(db_corretora).catch(err => logger.error(err));

      res.status(200).json({"Message":"Corretora e gerente cadastrados com sucesso!"});
    }
});


//Alterar o objeto da corretora

router.post('/:id/edit', async(req,res) => {

  let req_corretora = req.body;

  req_corretora['_id'] = req.params.id;

  let db_corretora = await controller.get_corretora_by_id(req.params.id);

  Object.keys(req_corretora).forEach(function(key) {
    let val = req_corretora[key];
    db_corretora[key] = val;
  });

  let edited_corretora = await db.update_corretora(db_corretora).catch(err => logger.error(err));

  let to_send ={
    "message":"Corretora editada com sucesso!",
    "corretora": edited_corretora
  }

  await res.json(to_send);
});

module.exports = router;
