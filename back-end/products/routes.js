const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger');
const controller = require('./controller')

router.get ('/', (req,res) => {
  res.status(200).json({"message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_produtos = await controller.get_produtos();

  res.status(200).json(all_produtos);
});

router.post('/filter', async (req,res) => {
  const filter_params = req.body.filters;

  if(filter_params === undefined){
    return res.status(400).json({ message: "Filtros inválidos" })
  }

  let filter_produtos = await controller.get_filtered_produtos(filter_params)

  if(filter_produtos.valid){
    return res.status(200).json(filter_produtos.data)
  } else {
    return res.status(400).json({ message: filter_produtos.message })
  }
})

router.get('/:id', async(req,res)=>{
  to_send = await controller.get_produto_by_id(req.params.id);

  res.status(200).json(to_send);
});

router.post('/new', async(req,res) => {
    var new_produto = req.body;

    let validacao_prod = controller.validate_produto(new_produto);

    if(!validacao_prod.valid){
      return res.status(400).json({"message":validacao_prod.message});
    }

    logger.log(new_produto);

    await controller.register_produto(new_produto);

    res.status(200).json({"message":"Produto cadastrado com sucesso!"});
});


//Alterar o objeto da produto

router.post('/:id/edit', async(req,res) => {

  let req_produto = req.body;

  req_produto['_id'] = req.params.id;

  let db_produto = await controller.get_produto_by_id(req.params.id)

  // Editando objeto
  let entradas_editadas = Object.entries(db_produto)
  .map(([key, value]) =>{ return [key, req_produto[key] || value]; })

  let entradas_novas = Object.entries(req_produto).filter(([key,value]) => {
    let existente = entradas_editadas.find(([key_e, value_e]) => {
      return key_e === key;
    })
    return existente === undefined;
  })

  for (var i = 0; i < entradas_novas.length; i++) {
    entradas_editadas.push(entradas_novas[i])
  }


  let obj_editado = Object.fromEntries(entradas_editadas);

  // Salvando objeto editado
  let edited_produto = await db.update_produto(obj_editado).catch(err => logger.error(err));

  res.status(200).json({
    message: "Produto editado com sucesso!",
    product: edited_produto.ops[0]
  });
});

module.exports = router;
