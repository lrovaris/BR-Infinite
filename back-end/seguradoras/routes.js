const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger');

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
      corretor_valid = false;
      return;
    }

    if (!gerente.name){
      res.status(400).json({"Message":"Campo de nome do colaborador vazio"});
      corretor_valid = false;
      return;
    }

    if (!gerente.telephone){
      res.status(400).json({"Message":"Campo de telefone do colaborador vazio"});
      corretor_valid = false;
      return;
    }

    if (!gerente.email){
      res.status(400).json({"Message":"Campo de email do colaborador vazio"});
      corretor_valid = false;
      return;
    }

    if (!gerente.birthday){
      res.status(400).json({"Message":"Campo de aniversário vazio"});
      corretor_valid = false;
      return;
    }

    if (!gerente.job){
      res.status(400).json({"Message":"Campo de cargo vazio"});
      corretor_valid = false;
      return;
    }

    if (valid && gerente_valid) {

      let new_seg = await db.register_seguradora(new_seguradora).catch(err => logger.error(err));

      gerente.seguradora = new_seg.insertedId;

      let new_colab = await colaborador_db.register_colaborador(gerente).catch(err => {logger.log(err);});

      let db_seguradora = new_seg.ops[0];

      db_seguradora["colaboradores"] = [ new_colab.insertedId ];

      db_seguradora["manager"] = new_colab.insertedId;

      await db.update_seguradora(db_seguradora).catch(err => console.error(err));

      res.status(200).json({"Message":"Segudoradora e gerente cadastrados com sucesso!"});
    }
});


//Alterar o objeto da seguradora

router.post('/:id/edit', async(req,res) => {

  let req_seguradora = req.body;

  req_seguradora['_id'] = req.params.id;

  let db_seguradora = cache.get("seguradoras").filter((seguradora_obj) => {
      return seguradora_obj._id == req_seguradora._id;
  })[0];

  Object.keys(req_seguradora).forEach(function(key) {
    let val = req_seguradora[key];
    db_seguradora[key] = val;
  });

  let edited_seguradora = await db.update_seguradora(db_seguradora).catch(err => logger.error(err));

  await res.json(edited_seguradora);
});

module.exports = router;
