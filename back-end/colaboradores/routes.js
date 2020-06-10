const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const controller = require('./controller')

const seguradoras_controller = require('../seguradoras/controller')

router.get ('/', (req,res) => {
  res.status(200).json({"message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_colaboradores = await controller.get_colaboradores()

  res.status(200).json(all_colaboradores);
});

router.get ('/birthday', async (req,res) => {
  let colab_list = await controller.get_colaboradores_by_birthday();

  res.status(200).json(colab_list);
});

router.get ('/:id', async (req,res) => {
  to_send = await controller.get_colaboradores_by_id(req.params.id);

  res.status(200).json(to_send);
});

router.post('/new', async(req,res) => {
    let new_colaborador = req.body;

    let validacao = controller.validate_colaborador(new_colaborador);

    if(!validacao.valid){
      return res.status(400).json({"message":validacao.message});
    }

    new_colaborador['active'] = true;

    let db_colab = await controller.register_colaborador(new_colaborador);

    res.status(200).json({
      message: "Colaborador cadastrado com sucesso!",
      colaborador: db_colab
    });
});


// Rota para alterar o objeto da colaborador
router.post('/:id/edit', async(req,res) => {

  // Extraindo objeto editado do corpo da mensagem
  let req_colaborador = req.body;

  // Procurando o objeto atual no banco de dados / cache
  let db_colaborador = await controller.get_colaboradores_by_id(req.params.id);

  // Editando o objeto
  let entradas_editadas = Object.entries(db_colaborador)
  .map(([key, value]) =>{ return [key, req_colaborador[key] || value]; })

  let entradas_novas = Object.entries(req_colaborador).filter(([key,value]) => {
    let existente = entradas_editadas.find(([key_e, value_e]) => {
      return key_e === key;
    })
    return existente === undefined;
  })

  for (var i = 0; i < entradas_novas.length; i++) {
    entradas_editadas.push(entradas_novas[i])
  }


  let obj_editado = Object.fromEntries(entradas_editadas);

  // Validando o objeto editado
  let validacao = await controller.validate_colaborador(obj_editado);

  // Respondendo se há erros na validação
  if(!validacao.valid){
    return res.status(400).json({"message": validacao.message});
  }

  // Editando o valor no banco de dados
  let edited_colaborador = await db.update_colaborador(obj_editado).catch(err => console.error(err));

  // Respondendo operação bem-sucedida
  res.status(200).json({
    "message": "Colaborador editado com sucesso!",
    "colaborador": edited_colaborador
  });
});

router.post('/:id/delete', async(req,res)=>{
  let db_colaborador = await controller.get_colaboradores_by_id(req.params.id);

  db_colaborador.active = false;

  let inactive_colaborador = await db.update_colaborador(db_colaborador).catch(err => console.error(err));

  res.status(200).json({
    "message":"Colaborador deletado com sucesso"
  })
})

module.exports = router;
