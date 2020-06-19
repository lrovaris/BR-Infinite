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

router.get ('/all/csv', async (req,res) => {
  controller.get_all_seguradoras_csv((response) => {

    res.download(`relatorios/${response.path}`)
  })
});

router.get ('/all', async (req,res) => {
  let all_seguradoras = await controller.get_seguradoras();

  res.status(200).json(all_seguradoras);
});

router.get('/:id/csv', async(req,res) => {
  controller.get_seguradora_csv(req.params.id, (response) => {

    res.download(`relatorios/${response.path}`)
  })
})

router.get ('/:id', async (req,res) => {
  let this_seg = await controller.get_seguradora_by_id(req.params.id);

  logger.log(this_seg);

  if(this_seg.manager){
    let colab_info = await colab_controller.get_colaboradores_seguradora(req.params.id, this_seg.manager._id || this_seg.manager);

    this_seg.colaboradores = colab_info.colaboradores;

    this_seg.manager = colab_info.manager;
  }

  res.status(200).json(this_seg);
});

router.post('/new', async(req,res) => {
    let new_seguradora = req.body.seguradora;

    let validacao = await controller.validate_seguradora(new_seguradora);

    if(!validacao.valid){
      return res.status(400).json({"message":validacao.message});
    }

    // Validação dos campos do gerente
    let gerente = req.body.manager;

    let validacao_gerente = colab_controller.validate_colaborador(gerente);

    if (!validacao_gerente.valid){
      return res.status(400).json({"message": validacao_gerente.message});
    }

    let db_seg = await controller.register_seguradora(new_seguradora);

    gerente.seguradora = db_seg._id.toString();
    gerente.active = true;

    let db_colab = await colaborador_db.register_colaborador(gerente).catch(err => {logger.log(err);});

    // Modificando o objeto da seguradora com as informações do gerente
    db_seg["manager"] = db_colab._id;
    await db.update_seguradora(db_seg).catch(err => logger.error(err));

    // Enviando resposta de operação bem-sucedida
    res.status(200).json({
      message:"Seguradora e gerente cadastrados com sucesso!",
      seguradora: db_seg,
      gerente: db_colab
    });
});


//Alterar o objeto da seguradora

router.post('/:id/edit', async(req,res) => {

  let req_seguradora = req.body;

  let db_seguradora = await controller.get_seguradora_by_id(req.params.id);

  // Editando objeto
  let entradas_editadas = Object.entries(db_seguradora)
  .map(([key, value]) =>{ return [key, req_seguradora[key] || value]; })

  let entradas_novas = Object.entries(req_seguradora).filter(([key,value]) => {
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
  let edited_seguradora = await db.update_seguradora(obj_editado).catch(err => logger.error(err));

  await res.json({
    "message":"Seguradora editada com sucesso!",
    "seguradora": edited_seguradora
  });
});

module.exports = router;
