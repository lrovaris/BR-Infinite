const express = require('express');
const router = express.Router();
const db = require('./db');
var cache = require('../memoryCache');

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

    var new_seguradora = req.body;

    if (!new_seguradora.name){
      res.status(400).json({"Message":"Campo de nome vazio"});
      valid = false;
    }

    if (valid) {
      console.log(new_seguradora);
      await db.register_seguradora(new_seguradora).catch(err => console.error(err));
      res.status(200).json({"Message":"Segudoradora cadastrada com sucesso!"});
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

  let edited_seguradora = await db.update_seguradora(db_seguradora).catch(err => console.error(err));

  await res.json(edited_seguradora);
});

module.exports = router;
