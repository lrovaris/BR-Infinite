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

router.get ('/all', async (req,res) => {
  let all_corretoras = await controller.get_corretoras();

  res.status(200).json(all_corretoras);
});

router.get('/:id', async(req,res) => {
  let db_corretora = await controller.get_corretora_by_id(req.params.id);

  let colab_info = await colaborador_controller.get_colaboradores_corretora(req.params.id, db_corretora.manager._id || db_corretora.manager);

  db_corretora.colaboradores = colab_info.colaboradores;

  db_corretora.manager = colab_info.manager;

  res.status(200).json(db_corretora);
});

router.post('/new', async(req,res) => {

    let corretora_valid = true;

    let new_corretora = req.body.corretora;

    let validacao_corr = controller.validate_corretora(new_corretora);

    if(!validacao_corr.valid){
      return res.status(400).json({"message":validacao_corr.message});
    }

    let corretor_responsavel = req.body.manager;

    let validacao_colab = colaborador_controller.validate_colaborador(corretor_responsavel);

    if(!validacao_colab.valid){
      return res.status(400).json({"message": validacao_colab.message});
    }

    let db_corretora = controller.register_corretora(new_corretora)

    corretor_responsavel.corretora = db_corretora._id;

    let new_colab = await colaborador_db.register_colaborador(corretor_responsavel).catch(err => {logger.log(err);});

    db_corretora["manager"] = new_colab.insertedId;

    await db.update_corretora(db_corretora).catch(err => logger.error(err));

    res.status(200).json({"message":"Corretora e gerente cadastrados com sucesso!"});
});


//Alterar o objeto da corretora

router.post('/:id/edit', async(req,res) => {
  let req_corretora = req.body;

  let db_corretora = await controller.get_corretora_by_id(req.params.id);

  let obj_editado = Object.fromEntries(Object.entries(db_corretora).map(([key, value]) =>{
    return [key, req_corretora[key] || value];
  }));

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

module.exports = router;
