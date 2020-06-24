const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger');
const controller = require('./controller')
const multer  = require('multer')
const fs = require('fs');



router.get ('/', (req,res) => {
  res.status(200).json({"message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_opportunities = await controller.get_opportunities();

  let formatted_response = await controller.formatToResponse(all_opportunities)

  res.status(200).json(formatted_response);
});

router.post('/filter', async (req,res) => {
  const filter_params = req.body.filters;

  if(filter_params === undefined){
    return res.status(400).json({ message: "Filtros inválidos" })
  }

  let filter_opportunities = await controller.get_filtered_opportunities(filter_params)

  if(filter_opportunities.valid){
    let formatted_response = await controller.formatToResponse(filter_opportunities.data)

    return res.status(200).json(formatted_response)
  } else {
    return res.status(400).json({ message: filter_opportunities.message })
  }
})

router.get('/:id', async(req,res)=>{
  to_send = await controller.get_opportunity_by_id(req.params.id);

  res.status(200).json(to_send);
});


router.post('/new', async(req,res) => {
    var new_opportunity = req.body;

    let validacao_opp =  await controller.validate_opportunity(new_opportunity);

    if(!validacao_opp.valid){
      return res.status(400).json({"message":validacao_opp.message});
    }

    let new_opp = await db.register_opportunity(new_opportunity).catch(err => logger.error(err));

    res.status(200).json({"message":"Oportunidade cadastrada com sucesso!"});
});


//Alterar o objeto da opportunity

router.post('/:id/edit', async(req,res) => {

  let req_opportunity = req.body;

  db_opportunity = await controller.get_opportunity_by_id(req.params.id);

  // Editando objeto
  let entradas_editadas = Object.entries(db_opportunity)
  .map(([key, value]) =>{ return [key, req_opportunity[key] || value]; })

  let entradas_novas = Object.entries(req_opportunity).filter(([key,value]) => {
    let existente = entradas_editadas.find(([key_e, value_e]) => {
      return key_e === key;
    })
    return existente === undefined;
  })

  for (var i = 0; i < entradas_novas.length; i++) {
    entradas_editadas.push(entradas_novas[i])
  }


  let obj_editado = Object.fromEntries(entradas_editadas);

  // Validando objeto editado
  let validacao_opp = await controller.validate_opportunity(obj_editado);

  if(!validacao_opp.valid){
    return res.status(400).json({"message":validacao_opp.message});
  }

  let edited_opportunity = await db.update_opportunity(obj_editado).catch(err => logger.error(err));

  res.status(200).json({
    message: "Oportunidade editada com sucesso!",
    opportunity: edited_opportunity.ops[0]
  });
});


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/oportunidades');
     },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        cb(null , uniqueSuffix+file.originalname);
    }
});

const upload = multer({ storage: storage })

router.post('/upload', upload.array('docs'), async(req,res) =>{
  if(!req.files){
    res.stats(400).json({ message: "Arquivos inválidos" })
  }

  let this_files = req.files.map(file_obj =>{
    return{
      nome: file_obj.originalname,
      path: file_obj.filename
    }
  })

  res.status(200).json({
    message: "Upload concluído!",
    info_files: this_files
  })
})

router.post('/download', async(req,res)=>{
  let to_download = req.body;

  if(!to_download.path){
    res.status(400).json({message: "Caminho para imagem inválido"})
  }

  res.download(`./uploads/oportunidades/${to_download.path}`)
})

router.post('/deleteFile', async(req,res)=>{
  let to_delete = req.body;

  if(!to_delete.path){
    res.status(400).json({message: "Caminho para imagem inválido"})
  }

  try {
    fs.unlinkSync(`./uploads/oportunidades/${to_delete.path}`)
    res.status(200).json({message:"Arquivo deletado com sucesso"})
  } catch(err) {
    logger.error(err)
    res.status(500).json({message:"Ocorreu um erro", erro:err})
  }
})

module.exports = router;
