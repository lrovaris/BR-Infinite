const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger');
const colaborador_db = require('../colaboradores/db')
const colab_controller = require('../colaboradores/controller')

router.get ('/', (req,res) => {
  res.status(200).json({"Message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_seguradoras = cache.get("seguradoras");

  if (all_seguradoras !== undefined){
      res.status(200).json(cache.get("seguradoras"));
  }

  else {
    all_seguradoras = await db.get_seguradoras();

    res.status(200).json(cache.get("seguradoras"));
  }
});

router.get ('/:id', async (req,res) => {
  let all_seguradoras = cache.get("seguradoras");

  let this_seg = all_seguradoras.filter(seg =>{
    return seg._id == req.params.id
  })[0]

  let colaboradores = await colab_controller.get_colaboradores();

  let colaboradores_ext = [];

  for (var i = 0; i < this_seg.colaboradores.length; i++) {
      if(this_seg.colaboradores[i]._id){
        colaboradores_ext.push(this_seg.colaboradores[i]);
        continue;
      }

      let id_colab = this_seg.colaboradores[i];

      colaboradores_ext.push(colaboradores.filter(colab_obj =>{
        return colab_obj._id + "" === id_colab + ""
      })[0])
  }

  this_seg.colaboradores = colaboradores_ext;

  // logger.log(this_seg);

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

      db_seguradora["colaboradores"] = [ new_colab.insertedId ];

      db_seguradora["manager"] = {
        "id": new_colab.insertedId,
        "name": new_colab.ops[0].name,
        "email": new_colab.ops[0].email
      }

      await db.update_seguradora(db_seguradora).catch(err => logger.error(err));

      res.status(200).json({"Message":"Seguradora e gerente cadastrados com sucesso!"});
    }
});


//Alterar o objeto da seguradora

router.post('/:id/edit', async(req,res) => {


  let req_seguradora = req.body;

  this_id = req.params.id;

  let db_seguradora = cache.get("seguradoras").filter((seguradora_obj) => {
      return seguradora_obj._id == this_id;
  })[0];

  console.log(req_seguradora);

  Object.keys(req_seguradora).forEach(function(key) {
    let val = req_seguradora[key];
    console.log(key, val);
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
