const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger');
const controller = require('./controller')

router.get ('/', (req,res) => {
  res.status(200).json({"Message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_produtos = await controller.get_produtos();

  res.status(200).json(all_produtos);
});

router.get('/:id', async(req,res)=>{
  to_send = await controller.get_produto_by_id(req.params.id);

  res.status(200).json(to_send);
});

router.post('/new', async(req,res) => {
    var valid = true;

    var new_produto = req.body;

    if (!new_produto.name){
      res.status(400).json({"Message":"Campo de nome vazio"});
      valid = false;
      return;
    }

    if (!new_produto.description){
      res.status(400).json({"Message":"Campo de descrição vazio"});
      valid = false;
      return;
    }

    if (!new_produto.seguradoras){
      res.status(400).json({"Message":"Nenhuma seguradora selecionada"});
      valid = false;
      return;
    }

    if (valid) {
      logger.log(new_produto);
      await db.register_produto(new_produto).catch(err => logger.error(err));
      res.status(200).json({"Message":"Produto cadastrado com sucesso!"});
    }
});


//Alterar o objeto da produto

router.post('/:id/edit', async(req,res) => {

  let req_produto = req.body;

  req_produto['_id'] = req.params.id;

  let db_produto = cache.get("produtos").filter((produto_obj) => {
      return produto_obj._id == req_produto._id;
  })[0];

  Object.keys(req_produto).forEach(function(key) {
    let val = req_produto[key];
    db_produto[key] = val;
  });

  let edited_produto = await db.update_produto(db_produto).catch(err => logger.error(err));

  to_send = {
    message: "Produto editado com sucesso!",
    product: edited_produto.ops[0]
  }

  res.status(200).json(to_send);
});

module.exports = router;
