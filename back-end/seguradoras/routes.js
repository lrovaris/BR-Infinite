const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger');
const colaborador_db = require('../colaboradores/db')
const colab_controller = require('../colaboradores/controller')
const controller = require('./controller')

router.get ('/', (req,res) => {
  res.status(200).json({"Message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_seguradoras = await controller.get_seguradoras();

  res.status(200).json(all_seguradoras);
});

router.get ('/:id', async (req,res) => {
  let this_seg = await controller.get_seguradora_by_id(req.params.id);

  console.log(this_seg);

  let manager_id;

  if(this_seg.manager){
    if(this_seg.manager._id){
      manager_id = this_seg.manager._id
    }else {
      manager_id = this_seg.manager
    }
  }

  let colab_info = await colab_controller.get_colaboradores_seguradora(req.params.id, manager_id);

  this_seg.colaboradores = colab_info.colaboradores;

  this_seg.manager = colab_info.manager;

  res.status(200).json(this_seg);
});

router.post('/new', async(req,res) => {
    var valid = true;

    var new_seguradora = req.body.seguradora;

    if (!new_seguradora.name){
      res.status(400).json({"Message":"Campo de nome vazio"});
      valid = false;
      return;
    }

    if (!new_seguradora.cnpj){
      res.status(400).json({"Message":"Campo de CNPJ vazio"});
      valid = false;
      return;
    }

    if (!new_seguradora.telephone){
      res.status(400).json({"Message":"Campo de telefone vazio"});
      valid = false;
      return;
    }

    if (!new_seguradora.address){
      res.status(400).json({"Message":"Campo de endereço vazio"});
      valid = false;
      return;
    }

    let gerente = req.body.manager;

    let gerente_valid = true;

    if(!gerente){
      res.status(400).json({"Message":"Colaborador inválido"});
      gerente_valid = false;
      return;
    }

    if (!gerente.name){
      res.status(400).json({"Message":"Campo de nome do colaborador vazio"});
      gerente_valid = false;
      return;
    }

    if (!gerente.telephone){
      res.status(400).json({"Message":"Campo de telefone do colaborador vazio"});
      gerente_valid = false;
      return;
    }

    if (!gerente.email){
      res.status(400).json({"Message":"Campo de email do colaborador vazio"});
      gerente_valid = false;
      return;
    }

    if (!gerente.birthday){
      res.status(400).json({"Message":"Campo de aniversário vazio"});
      gerente_valid = false;
      return;
    }

    if (!gerente.job){
      res.status(400).json({"Message":"Campo de cargo vazio"});
      gerente_valid = false;
      return;
    }

    if (valid && gerente_valid) {

      let new_seg = await db.register_seguradora(new_seguradora).catch(err => logger.error(err));

      gerente.seguradora = new_seg.insertedId;

      let new_colab = await colaborador_db.register_colaborador(gerente).catch(err => {logger.log(err);});

      let db_seguradora = new_seg.ops[0];

      db_seguradora["manager"] = new_colab.insertedId;

      await db.update_seguradora(db_seguradora).catch(err => logger.error(err));

      res.status(200).json({"Message":"Seguradora e gerente cadastrados com sucesso!"});
    }
});


//Alterar o objeto da seguradora

router.post('/:id/edit', async(req,res) => {

  let req_seguradora = req.body;

  let db_seguradora = await controller.get_seguradora_by_id(req.params.id);

  logger.log(req_seguradora);

  Object.keys(req_seguradora).forEach(function(key) {
    let val = req_seguradora[key];
    db_seguradora[key] = val;
  });

  let edited_seguradora = await db.update_seguradora(db_seguradora).catch(err => logger.error(err));

  let to_send= {
    "message":"Seguradora editada com sucesso!",
    "seguradora": edited_seguradora
  }

  await res.json(to_send);
});

module.exports = router;
