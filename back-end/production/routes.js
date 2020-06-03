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

    if(new_entry_path === undefined){
      return res.status(400).json({"message":"Caminho indefinido"})
    }

    if(this_seguradora === undefined){
      return res.status(400).json({"message":"Seguradora inválida"});
    }

    let seg_obj =  await seguradora_controller.get_seguradora_by_id(this_seguradora)

    if(seg_obj === undefined){
      return res.status(400).json({"message":"Seguradora inválida"});
    }

    let seg_id = seg_obj._id.toString();


    let entries = [];
    let valid = true;
    let message;
    let rows = [];

    let path_to_file = `./uploads/production/${new_entry_path}`;

    if (fs.existsSync(path_to_file)){
      fs.createReadStream(path_to_file)
      .pipe(csv())
      .on('data', async(row) => {
        rows.push(row);
      })
      .on('finish', async() =>{
        let validation = await controller.validate_entries(rows, seg_id);

        not_valid_entry = validation.find(validation_obj => validation_obj.valid === false);

        entries = validation.map(validation_obj => validation_obj.entry);


        if(not_valid_entry === undefined){
          let db_entries = await controller.register_entries(entries);

          res.status(200).json({"message":"Entradas cadastradas com sucesso!"});
        }else {

          res.status(400).json({"message":not_valid_entry.message});
        }
      });

    }else {
      res.status(400).json({"message":"Caminho inválido"});
    }
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


// Relatórios e comparações

router.get ('/seguradoras/:id', async (req,res) => {
  let seg_dates = await controller.get_seguradora_dates(req.params.id);

  res.status(200).json({
    dates: seg_dates
  });
});

router.post ('/seguradoras/:id/report/monthly', async (req,res) => {
  let seg_id = req.params.id;

  if(seg_id === undefined){
    return res.status(400).json({
      message: "Seguradora inválida"
    })
  }

  let year = req.body.year;

  if(year === undefined){
    return res.status(400).json({
      message: "Ano inválido"
    })
  }

  year = Number(year.toString());

  let month = req.body.month;

  if(month === undefined){
    return res.status(400).json({
      message: "Mês inválido"
    })
  }

  month = Number(month.toString())

  let report = await controller.get_seguradora_month_report(req.params.id, year, month);

  res.status(200).json({
    report: report
  });
});



module.exports = router;
