const express = require('express');
const router = express.Router();
const db = require('./db');
const cache = require('../memoryCache');
const logger = require('../logger');
const controller = require('./controller')
const multer  = require('multer')
const fs = require('fs');
const csv = require('csv-parser');

const seguradora_controller = require('../seguradoras/controller')

router.get ('/', (req,res) => {
  res.status(200).json({"message":"Funcionando"});
});

router.get ('/all', async (req,res) => {
  let all_entries = await controller.get_entries();

  res.status(200).json(all_entries);
});

router.post('/new', async(req,res) => {
    let new_entry_path = req.body.path;

    let this_seguradora = req.body.seguradora;

    if(this_seguradora === undefined){
      return res.status(400).json({"message":"Seguradora inválida"});
    }

    let seg_obj =  await seguradora_controller.get_seguradora_by_id(this_seguradora)

    if(seg_obj === undefined){
      return res.status(400).json({"message":"Seguradora inválida"});
    }

    let seg_id = seg_obj._id.toString();

    let current_date = new Date();
    let entries = [];
    let valid = true;
    let message;

    fs.createReadStream("./uploads/production/"+new_entry_path)
      .pipe(csv())
      .on('data', async(row) => {

        let validation = await controller.validate_entry(row)

        if(validation.valid){
          let to_db = validation.entry;
          to_db.sentDate = current_date;
          to_db.seguradora = seg_id;
          entries.push(to_db)
        }else{
          valid = false;
          message = validation.message
        }
      })
      .on('end', async() => {
        if(valid){
          let db_entries = await controller.register_entries(entries);

          res.status(200).json({"message":"Entradas cadastradas com sucesso!"});
        }else {

          res.status(400).json({"message":message});
        }

      });
});


//  Upload / Download

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/production');
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


module.exports = router;
