const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger');
const controller = require('./controller')
const multer  = require('multer')

const corretora_controller = require('../corretoras/controller')
const colaborador_controller = require('../colaboradores/controller')
const product_controller = require('../products/controller')
const seguradora_controller = require('../seguradoras/controller')

router.get ('/', (req,res) => {
  res.status(200).json({"message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_opportunities = await controller.get_opportunities();


  let norm_opp = await all_opportunities.flatMap(async(obj) =>{
    let this_corr = await corretora_controller.get_corretora_by_id(obj.corretora._id || obj.corretora);

    if(this_corr !== undefined){
      obj.corretora = {
        name: this_corr.name,
        _id: this_corr._id
      }
    }


    let this_seg = await seguradora_controller.get_seguradora_by_id(obj.seguradora._id || obj.seguradora);

    if (this_seg !== undefined){
      obj.seguradora = {
        name: this_seg.name,
        _id: this_seg._id
      }
    }


    let this_colab = await colaborador_controller.get_colaboradores_by_id(obj.colaborador._id || obj.colaborador);

    if(this_colab !== undefined){
      obj.colaborador = {
        name: this_colab.name,
        _id: this_colab._id
      }
    }


    let this_prod = await product_controller.get_produto_by_id(obj.product._id || obj.product);

    if(this_prod !== undefined){
      obj.product = {
        name: this_prod.name,
        _id: this_prod._id
      }
    }


    return obj;
  })

  // norm_opp = await norm_opp.flatMap(obj => norm_seg(obj))

  const results = await Promise.all(norm_opp);

  res.status(200).json(all_opportunities);
});

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

  let obj_editado = Object.fromEntries(Object.entries(db_opportunity).map(([key, value]) =>{
    return [key, req_opportunity[key] || value];
  }));

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

module.exports = router;
