const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const controller = require('./controller')

const seguradoras_controller = require('../seguradoras/controller')

router.get ('/', (req,res) => {
  res.status(200).json({"Message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_colaboradores = await controller.get_colaboradores()

  res.status(200).json(all_colaboradores);
});

router.get ('/:id', async (req,res) => {
  to_send = await controller.get_colaboradores_by_id(req.params.id);

  res.status(200).json(to_send);
});

router.post('/new', async(req,res) => {
    var valid = true;

    var new_colaborador = req.body;

    if (!new_colaborador.name){
      res.status(400).json({"Message":"Campo de nome vazio"});
      valid = false;
      return;
    }

    if (!new_colaborador.telephone){
      res.status(400).json({"Message":"Campo de telefone vazio"});
      valid = false;
      return;
    }

    if (!new_colaborador.email){
      res.status(400).json({"Message":"Campo de email vazio"});
      valid = false;
      return;
    }

    if (!new_colaborador.birthday){
      res.status(400).json({"Message":"Campo de aniversário vazio"});
      valid = false;
      return;
    }

    if (!new_colaborador.job){
      res.status(400).json({"Message":"Campo de cargo vazio"});
      valid = false;
      return;
    }

    new_colaborador['active'] = true;

    if (valid) {
      let db_response = await db.register_colaborador(new_colaborador).catch(err => console.error(err));

      let to_send = {
        message: "Colaborador cadastrado com sucesso!",
        colaborador: db_response.ops[0]
      }

      res.status(200).json(to_send);
    }
});


//Alterar o objeto da colaborador

router.post('/:id/edit', async(req,res) => {

  let req_colaborador = req.body;

  req_colaborador['_id'] = req.params.id;

  let db_colaborador = cache.get("colaboradores").filter((colaborador_obj) => {
      return colaborador_obj._id == req_colaborador._id;
  })[0];

  Object.keys(req_colaborador).forEach(function(key) {
    let val = req_colaborador[key];
    db_colaborador[key] = val;
  });

  let edited_colaborador = await db.update_colaborador(db_colaborador).catch(err => console.error(err));

  await res.json(edited_colaborador);
});

module.exports = router;
