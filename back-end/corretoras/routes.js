const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger')
const colaborador_db = require('../colaboradores/db');
const colaborador_controller = require('../colaboradores/controller');
const controller = require('./controller');
const multer  = require('multer')

router.get ('/', (req,res) => {
  res.status(200).json({"message":"Funcionando"});
});

router.post('/all/csv', async(req,res) => {
  let filters = req.body.filters

  if(filters === undefined){
    filters = [];
  }

  console.log('chegou request para todas');

  controller.get_all_corretoras_csv(filters, (response) => {

    res.download(`relatorios/${response.path}`)
  })
})

router.get ('/all', async (req,res) => {
  let all_corretoras = await controller.get_corretoras();

  res.status(200).json(all_corretoras);
});

router.post('/filter', async (req,res) => {
  const filter_params = req.body.filters;

  if(filter_params === undefined){
    return res.status(400).json({ message: "Filtros inválidos" })
  }

  let filter_corretoras = await controller.get_filtered_corretoras(filter_params)

  if(filter_corretoras.valid){
    return res.status(200).json(filter_corretoras.data)
  } else {
    return res.status(400).json({ message: filter_corretoras.message })
  }
})

router.get('/:id/csv', async(req,res) => {
  console.log('chegou request individual');
  controller.get_corretora_csv(req.params.id, (response) => {

    res.download(`relatorios/${response.path}`)
  })
})

router.get('/:id', async(req,res) => {
  let db_corretora = await controller.get_corretora_by_id(req.params.id);

  if(db_corretora.manager){
    let colab_info = await colaborador_controller.get_colaboradores_corretora(req.params.id, db_corretora.manager._id || db_corretora.manager);

    db_corretora.colaboradores = colab_info.colaboradores;

    db_corretora.manager = colab_info.manager;
  }

  res.status(200).json(db_corretora);
});

router.post('/new', async(req,res) => {

    let new_corretora = req.body.corretora;

    let validacao_corr = await controller.validate_corretora(new_corretora);

    if(!validacao_corr.valid){
      return res.status(400).json({"message":validacao_corr.message});
    }

    let corretor_responsavel = req.body.manager;

    let validacao_colab = colaborador_controller.validate_colaborador(corretor_responsavel);

    if(!validacao_colab.valid){
      return res.status(400).json({"message": validacao_colab.message});
    }

    let db_corretora = await controller.register_corretora(new_corretora)

    corretor_responsavel.corretora = db_corretora._id;
    corretor_responsavel.active = true;

    let new_colab = await colaborador_controller.register_colaborador(corretor_responsavel);

    db_corretora["manager"] = new_colab._id;

    let db_corr_to_send = await db.update_corretora(db_corretora).catch(err => logger.error(err));

    res.status(200).json({
      message:"Corretora e gerente cadastrados com sucesso!",
      corretora: db_corr_to_send,
      manager: new_colab
    });
});


//Alterar o objeto da corretora

router.post('/:id/edit', async(req,res) => {
  let req_corretora = req.body;

  let db_corretora = await controller.get_corretora_by_id(req.params.id);

  // edição de objeto
  let entradas_editadas = Object.entries(db_corretora)
  .map(([key, value]) =>{ return [key, req_corretora[key] || value]; })

  let entradas_novas = Object.entries(req_corretora).filter(([key,value]) => {
    let existente = entradas_editadas.find(([key_e, value_e]) => {
      return key_e === key;
    })
    return existente === undefined;
  })

  for (var i = 0; i < entradas_novas.length; i++) {
    entradas_editadas.push(entradas_novas[i])
  }


  let obj_editado = Object.fromEntries(entradas_editadas);

  // Validando objeto novo
  let validacao = await controller.validate_corretora(obj_editado);

  if(!validacao.valid){
    return res.status(400).json({"message": validacao.message});
  }

  let edited_corretora = await db.update_corretora(obj_editado).catch(err => logger.error(err));

  await res.status(200).json({
    "message":"Corretora editada com sucesso!",
    "corretora": edited_corretora
  });
});


//  Upload / Download

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/corretoras');
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

  res.download(`./uploads/corretoras/${to_download.path}`)
})

router.post('/deleteFile', async(req,res)=>{
  let to_delete = req.body;

  if(!to_delete.path){
    res.status(400).json({message: "Caminho para imagem inválido"})
  }

  try {
    fs.unlinkSync(`./uploads/corretoras/${to_delete.path}`)
    res.status(200).json({message:"Arquivo deletado com sucesso"})
  } catch(err) {
    logger.error(err)
    res.status(500).json({message:"Ocorreu um erro", erro:err})
  }
})

module.exports = router;
