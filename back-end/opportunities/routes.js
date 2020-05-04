const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger');
const controller = require('./controller')
const corretoras_controller = require('../corretoras/controller')
const colaboradores_controller = require('../colaboradores/controller')
const products_controller = require('../products/controller')

router.get ('/', (req,res) => {
  res.status(200).json({"message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_opportunities = await controller.get_opportunities();

  res.status(200).json(all_opportunities);
});

router.get('/:id', async(req,res)=>{
  to_send = await controller.get_opportunity_by_id(req.params.id);

  res.status(200).json(to_send);
});


router.post('/new', async(req,res) => {
    var new_opportunity = req.body;

    if (!new_opportunity.inclusionDate){
      return res.status(400).json({"message":"Nenhuma seguradora selecionada"});
    }

    if (!new_opportunity.corretora){
      return res.status(400).json({"message":"Nenhuma seguradora selecionada"});
    }else {
      let corr = await corretoras_controller.get_corretora_by_id(new_opportunity.corretora);

      if (corr === undefined){
        return res.status(400).json({"message":"Corretora inválida"});
      }
    }

    if (!new_opportunity.colaborador){
      return res.status(400).json({"message":"Nenhuma colaborador selecionado"});
    }else {
      let colab = await colaboradores_controller.get_colaboradores_by_id(new_opportunity.colaborador);

      if (colab === undefined){
        return res.status(400).json({"message":"Colaborador inválido"});
      }
    }

    if (!new_opportunity.product){
      return res.status(400).json({"message":"Nenhum produto selecionado"});
    }else {
      let prod = await products_controller.get_produto_by_id(new_opportunity.product);

      if (prod === undefined){
        return res.status(400).json({"message":"Produto inválido"});
      }
    }

    if (!new_opportunity.description){
      return res.status(400).json({"message":"Descrição inválida (descrição em branco)"});
    }

    if (!new_opportunity.dealType){
      return res.status(400).json({"message":"Tipo de negócio não selecionado"});
    }

    if (!new_opportunity.status){
      return res.status(400).json({"message":"Status não selecionado"});
    }


    logger.log(new_opportunity);

    await db.register_opportunity(new_opportunity).catch(err => logger.error(err));

    res.status(200).json({"message":"Oportunidade cadastrado com sucesso!"});
});


//Alterar o objeto da opportunity

router.post('/:id/edit', async(req,res) => {

  let req_opportunity = req.body;

  db_opportunity = await controller.get_opportunity_by_id(req.params.id);

  Object.keys(req_opportunity).forEach(function(key) {
    let val = req_opportunity[key];
    db_opportunity[key] = val;
  });

  let edited_opportunity = await db.update_opportunity(db_opportunity).catch(err => logger.error(err));

  to_send = {
    message: "Oportunidade editada com sucesso!",
    opportunity: edited_opportunity.ops[0]
  }

  res.status(200).json(to_send);
});

module.exports = router;
