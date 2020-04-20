const express = require('express');
const router = express.Router();
const db = require('./db');
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
    var valid = true;

    let new_corretora = req.body.corretora;
    let gerente = req.body.gerente;


    if (!new_corretora.name){
      res.status(400).json({"Message":"Campo de nome vazio"});
      valid = false;
    }



    if (valid) {
      console.log(new_corretora);
      await db.register_corretora(new_corretora).catch(err => console.error(err));
      res.status(200).json({"Message":"Corretora cadastrada com sucesso!"});
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
