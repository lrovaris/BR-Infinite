const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger');
const colaborador_db = require('../colaboradores/db')
const colab_controller = require('../colaboradores/controller')
const controller = require('./controller')

router.get ('/', (req,res) => {
  res.status(200).json({"message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_seguradoras = await controller.get_seguradoras();

  res.status(200).json(all_seguradoras);
});

router.get ('/:id', async (req,res) => {
  let this_seg = await controller.get_seguradora_by_id(req.params.id);

  logger.log(this_seg);

  let colab_info = await colab_controller.get_colaboradores_seguradora(req.params.id, this_seg.manager._id || this_seg.manager);

  this_seg.colaboradores = colab_info.colaboradores;

  this_seg.manager = colab_info.manager;

  res.status(200).json(this_seg);
});

router.post('/new', async(req,res) => {
    let new_seguradora = req.body.seguradora;

    //Validação dos campos da seguradora
    if (!new_seguradora.name){
      return res.status(400).json({"message":"Campo de nome vazio"});
    }

    if (!new_seguradora.cnpj){
      return res.status(400).json({"message":"Campo de CNPJ vazio"});
    }

    if (!new_seguradora.telephone){
      return res.status(400).json({"message":"Campo de telefone vazio"});
    }

    if (!new_seguradora.address){
      return res.status(400).json({"message":"Campo de endereço vazio"});
    }


    // Validação dos campos do gerente
    let gerente = req.body.manager;

    let validacao_gerente = colab_controller.validate_colaborador(gerente);

    if (!validacao_gerente.valid){
      return res.status(400).json({"message": validacao_gerente.message});
    }

    // Registrando a seguradora no banco de dados
    let new_seg = await db.register_seguradora(new_seguradora).catch(err => logger.error(err));

    // Editando o objeto do gerente para receber o ID da seguradora
    gerente.seguradora = new_seg.insertedId;


    // Registrando o gerente no banco de dados
    let new_colab = await colaborador_db.register_colaborador(gerente).catch(err => {logger.log(err);});

    // Modificando o objeto da seguradora com as informações do gerente
    let db_seguradora = new_seg.ops[0];
    db_seguradora["manager"] = new_colab.insertedId;
    await db.update_seguradora(db_seguradora).catch(err => logger.error(err));

    // Enviando resposta de operação bem-sucedida
    res.status(200).json({"message":"Seguradora e gerente cadastrados com sucesso!"});
});


//Alterar o objeto da seguradora

router.post('/:id/edit', async(req,res) => {

  let req_seguradora = req.body;

  let db_seguradora = await controller.get_seguradora_by_id(req.params.id);

  let obj_editado = Object.fromEntries(Object.entries(db_seguradora).map(([key, value]) =>{
    return [key, req_seguradora[key] || value];
  }));

  let edited_seguradora = await db.update_seguradora(obj_editado).catch(err => logger.error(err));

  await res.json({
    "message":"Seguradora editada com sucesso!",
    "seguradora": edited_seguradora
  });
});

module.exports = router;
