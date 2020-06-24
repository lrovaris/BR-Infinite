const express = require('express');
const router = express.Router();
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

    let this_date = req.body.date;

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

    if(this_date === undefined){
      return res.status(400).json({"message":"Data inválida"});
    }


    let entries = [];
    let valid = true;
    let message;
    let rows = [];

    let path_to_file = `./uploads/production/${new_entry_path}`;

    if (fs.existsSync(path_to_file)){
      fs.createReadStream(path_to_file)
      .pipe(csv({ separator: ';' }))
      .on('data', async(row) => {
        rows.push(row);
      })
      .on('finish', async() =>{
        let validation = await controller.validate_entries(rows, seg_id, this_date);

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

// Dias úteis

router.get ('/dates/all', async (req,res) => {
  let all_prod_dates = await controller.get_production_dates();

  return res.status(200).json(all_prod_dates);
});

router.post('/dates/new', async(req,res) => {

  let year = req.body.year;

  if(year === undefined){
    return res.status(400).json({ message: "Ano inválido" })
  }

  let month = req.body.month;

  if(month === undefined){
    return res.status(400).json({ message: "Mês inválido" })
  }

  let dayNumber = req.body.dayNumber;

  if(dayNumber === undefined){
    return res.status(400).json({ message: "Número de dias inválido" })
  }

  let db_date = await controller.register_production_date({ year, month, dayNumber })

  return res.status(200).json({ message: "Data de produção cadastrada com sucesso!", date: db_date })
})

router.post('/dates/:id/edit')

// Relatórios e comparações

router.get ('/seguradoras/home_report', async (req,res) => {
  let report = await controller.get_seguradora_home_reports();

  res.status(200).json({
    report: report
  });
});

router.get ('/seguradoras/:id', async (req,res) => {
  let seg_dates = await controller.get_seguradora_dates(req.params.id);

  res.status(200).json({
    dates: seg_dates
  });
});

router.post ('/seguradoras/:id/report/daily/csv', async (req,res) => {
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

  controller.get_seguradora_daily_report_csv(req.params.id, year, month, (response) =>{
    if(response.valid){
      res.download(`./relatorios/${response.path}`);
    }else {
      res.status(500).json({message: "Ocorreu um erro interno do servidor"})
    }
  });
});


router.post ('/seguradoras/:id/report/daily', async (req,res) => {
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

  let report = await controller.get_seguradora_daily_report(req.params.id, year, month);

  res.status(200).json({
    report: report
  });
});

router.post ('/seguradoras/:id/report/monthly', async (req,res) => {
  let seg_id = req.params.id;

  if(seg_id === undefined){
    return res.status(400).json({
      message: "Seguradora inválida"
    })
  }

  let begin_year = Number(req.body.beginYear);
  let begin_month = Number(req.body.beginMonth);
  let end_year = Number(req.body.endYear);
  let end_month = Number(req.body.endMonth);

  if(begin_year === undefined || typeof begin_year !== 'number'){
    return res.status(400).json({
      message: "Ano de início inválido"
    })
  }

  if(begin_month === undefined || typeof begin_month !== 'number'){
    return res.status(400).json({
      message: "Mês de início inválido"
    })
  }

  if(end_year === undefined || typeof end_year !== 'number'){
    return res.status(400).json({
      message: "Ano final inválido"
    })
  }

  if(end_month === undefined || typeof end_month !== 'number'){
    return res.status(400).json({
      message: "Mês final inválido"
    })
  }

  if(end_year < begin_year){
    return res.status(400).json({
      message: "O ano final deve ser posterior ao ano de início"
    })
  }

  if(end_month < begin_month && end_year === begin_year){
    return res.status(400).json({
      message: "O mês final deve ser posterior ao mês de início"
    })
  }


  let report = await controller.get_seguradora_monthly_report(seg_id, begin_year, begin_month, end_year, end_month);

  res.status(200).json({
    report: report
  });
});

router.post ('/seguradoras/:id/report/yearly', async (req,res) => {
  let seg_id = req.params.id;

  if(seg_id === undefined){
    return res.status(400).json({
      message: "Seguradora inválida"
    })
  }

  let begin_year = Number(req.body.beginYear);
  let end_year = Number(req.body.endYear);

  if(begin_year === undefined || typeof begin_year !== 'number'){
    return res.status(400).json({
      message: "Ano de início inválido"
    })
  }

  if(end_year === undefined || typeof end_year !== 'number'){
    return res.status(400).json({
      message: "Ano final inválido"
    })
  }

  if(end_year < begin_year){
    return res.status(400).json({
      message: "O ano final deve ser posterior ao ano de início"
    })
  }

  let report = await controller.get_seguradora_yearly_report(seg_id, begin_year, end_year);

  res.status(200).json({
    report: report
  });
});

router.post ('/seguradoras/:id/compare/daily', async (req,res) => {
  let seg_id = req.params.id;

  if(seg_id === undefined){
    return res.status(400).json({
      message: "Seguradora inválida"
    })
  }

  let first_year = req.body.firstYear;

  if(first_year === undefined){
    return res.status(400).json({
      message: "Primeiro ano inválido"
    })
  }

  first_year = Number(first_year.toString());

  let second_year = req.body.secondYear;

  if(second_year === undefined){
    return res.status(400).json({
      message: "Segundo ano inválido"
    })
  }

  second_year = Number(second_year.toString());

  if(first_year > second_year){
    return res.status(400).json({
      message: "O segundo ano deve ser posterior ou igual ao primeiro ano"
    })
  }

  let first_month = req.body.firstMonth;

  if(first_month === undefined){
    return res.status(400).json({
      message: "Primeiro mês inválido"
    })
  }

  first_month = Number(first_month.toString());

  let second_month = req.body.secondMonth;

  if(second_month === undefined){
    return res.status(400).json({
      message: "Segundo mês inválido"
    })
  }

  second_month = Number(second_month.toString());

  if(first_month > second_month && first_year === second_year){
    return res.status(400).json({
      message: "O segundo mês deve ser posterior ou igual ao primeiro mês"
    })
  }

  let first_day = req.body.firstDay;

  if(first_day === undefined){
    return res.status(400).json({
      message: "Primeiro dia inválido"
    })
  }

  first_day = Number(first_day.toString());

  let second_day = req.body.secondDay;

  if(second_day === undefined){
    return res.status(400).json({
      message: "Segundo dia inválido"
    })
  }

  second_day = Number(second_day.toString());

  if(first_day > second_day && first_year === second_year && first_month === second_month){
    return res.status(400).json({
      message: "O segundo dia deve ser posterior ou igual ao primeiro dia"
    })
  }

  let report = await controller.get_seguradora_daily_compare(seg_id, first_year, first_month, first_day, second_year, second_month, second_day);

  res.status(200).json({
    report: report
  });
});

router.post ('/seguradoras/:id/compare/monthly', async (req,res) => {
  let seg_id = req.params.id;

  if(seg_id === undefined){
    return res.status(400).json({
      message: "Seguradora inválida"
    })
  }

  let first_year = req.body.firstYear;

  if(first_year === undefined){
    return res.status(400).json({
      message: "Primeiro ano inválido"
    })
  }

  first_year = Number(first_year.toString());

  let second_year = req.body.secondYear;

  if(second_year === undefined){
    return res.status(400).json({
      message: "Segundo ano inválido"
    })
  }

  second_year = Number(second_year.toString());

  if(first_year > second_year){
    return res.status(400).json({
      message: "O segundo ano deve ser posterior ou igual ao primeiro ano"
    })
  }

  let first_month = req.body.firstMonth;

  if(first_month === undefined){
    return res.status(400).json({
      message: "Primeiro mês inválido"
    })
  }

  first_month = Number(first_month.toString());

  let second_month = req.body.secondMonth;

  if(second_month === undefined){
    return res.status(400).json({
      message: "Segundo mês inválido"
    })
  }

  second_month = Number(second_month.toString());

  if(first_month > second_month && first_year === second_year){
    return res.status(400).json({
      message: "O segundo mês deve ser posterior ou igual ao primeiro mês"
    })
  }

  let report = await controller.get_seguradora_monthly_compare(seg_id, first_year, first_month, second_year, second_month);

  res.status(200).json({
    report: report
  });
});

router.post ('/seguradoras/:id/compare/yearly', async (req,res) => {
  let seg_id = req.params.id;

  if(seg_id === undefined){
    return res.status(400).json({
      message: "Seguradora inválida"
    })
  }

  let first_year = req.body.firstYear;

  if(first_year === undefined){
    return res.status(400).json({
      message: "Primeiro ano inválido"
    })
  }

  first_year = Number(first_year.toString());

  let second_year = req.body.secondYear;

  if(second_year === undefined){
    return res.status(400).json({
      message: "Segundo ano inválido"
    })
  }

  second_year = Number(second_year.toString());

  if(first_year > second_year){
    return res.status(400).json({
      message: "O segundo ano deve ser posterior ou igual ao primeiro ano"
    })
  }

  let report = await controller.get_seguradora_yearly_compare(seg_id, first_year, second_year);

  res.status(200).json({
    report: report
  });
});

router.get ('/corretoras/:id', async (req,res) => {
  let corr_dates = await controller.get_corretora_dates(req.params.id);

  res.status(200).json({
    dates: corr_dates
  });
});

router.post ('/corretoras/:id/report/daily', async (req,res) => {
  let corr_id = req.params.id;

  if(corr_id === undefined){
    return res.status(400).json({
      message: "Corretora inválida"
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

  let report = await controller.get_corretora_daily_report(corr_id, year, month);

  res.status(200).json({
    report: report
  });
});

router.post ('/corretoras/:id/report/monthly', async (req,res) => {
  let corr_id = req.params.id;

  if(corr_id === undefined){
    return res.status(400).json({
      message: "Corretora inválida"
    })
  }

  let begin_year = Number(req.body.beginYear);
  let begin_month = Number(req.body.beginMonth);
  let end_year = Number(req.body.endYear);
  let end_month = Number(req.body.endMonth);

  if(begin_year === undefined || typeof begin_year !== 'number'){
    return res.status(400).json({
      message: "Ano de início inválido"
    })
  }

  if(begin_month === undefined || typeof begin_month !== 'number'){
    return res.status(400).json({
      message: "Mês de início inválido"
    })
  }

  if(end_year === undefined || typeof end_year !== 'number'){
    return res.status(400).json({
      message: "Ano final inválido"
    })
  }

  if(end_month === undefined || typeof end_month !== 'number'){
    return res.status(400).json({
      message: "Mês final inválido"
    })
  }

  if(end_year < begin_year){
    return res.status(400).json({
      message: "O ano final deve ser posterior ao ano de início"
    })
  }

  if(end_month < begin_month && end_year === begin_year){
    return res.status(400).json({
      message: "O mês final deve ser posterior ao mês de início"
    })
  }


  let report = await controller.get_corretora_monthly_report(corr_id, begin_year, begin_month, end_year, end_month);

  res.status(200).json({
    report: report
  });
});

router.post ('/corretoras/:id/report/yearly', async (req,res) => {
  let corr_id = req.params.id;

  if(corr_id === undefined){
    return res.status(400).json({
      message: "Corretora inválida"
    })
  }

  let begin_year = Number(req.body.beginYear);
  let end_year = Number(req.body.endYear);

  if(begin_year === undefined || typeof begin_year !== 'number'){
    return res.status(400).json({
      message: "Ano de início inválido"
    })
  }

  if(end_year === undefined || typeof end_year !== 'number'){
    return res.status(400).json({
      message: "Ano final inválido"
    })
  }

  if(end_year < begin_year){
    return res.status(400).json({
      message: "O ano final deve ser posterior ao ano de início"
    })
  }

  let report = await controller.get_corretora_yearly_report(corr_id, begin_year, end_year);

  res.status(200).json({
    report: report
  });
});

router.post ('/corretoras/:id/compare/daily', async (req,res) => {
  let corr_id = req.params.id;

  if(corr_id === undefined){
    return res.status(400).json({
      message: "Corretora inválida"
    })
  }

  let first_year = req.body.firstYear;

  if(first_year === undefined){
    return res.status(400).json({
      message: "Primeiro ano inválido"
    })
  }

  first_year = Number(first_year.toString());

  let second_year = req.body.secondYear;

  if(second_year === undefined){
    return res.status(400).json({
      message: "Segundo ano inválido"
    })
  }

  second_year = Number(second_year.toString());

  if(first_year > second_year){
    return res.status(400).json({
      message: "O segundo ano deve ser posterior ou igual ao primeiro ano"
    })
  }

  let first_month = req.body.firstMonth;

  if(first_month === undefined){
    return res.status(400).json({
      message: "Primeiro mês inválido"
    })
  }

  first_month = Number(first_month.toString());

  let second_month = req.body.secondMonth;

  if(second_month === undefined){
    return res.status(400).json({
      message: "Segundo mês inválido"
    })
  }

  second_month = Number(second_month.toString());

  if(first_month > second_month && first_year === second_year){
    return res.status(400).json({
      message: "O segundo mês deve ser posterior ou igual ao primeiro mês"
    })
  }

  let first_day = req.body.firstDay;

  if(first_day === undefined){
    return res.status(400).json({
      message: "Primeiro dia inválido"
    })
  }

  first_day = Number(first_day.toString());

  let second_day = req.body.secondDay;

  if(second_day === undefined){
    return res.status(400).json({
      message: "Segundo dia inválido"
    })
  }

  second_day = Number(second_day.toString());

  if(first_day > second_day && first_year === second_year && first_month === second_month){
    return res.status(400).json({
      message: "O segundo dia deve ser posterior ou igual ao primeiro dia"
    })
  }

  let report = await controller.get_corretora_daily_compare(corr_id, first_year, first_month, first_day, second_year, second_month, second_day);

  res.status(200).json({
    report: report
  });
})

router.post ('/corretoras/:id/compare/monthly', async (req,res) => {
  let corr_id = req.params.id;

  if(corr_id === undefined){
    return res.status(400).json({
      message: "Corretora inválida"
    })
  }

  let first_year = req.body.firstYear;

  if(first_year === undefined){
    return res.status(400).json({
      message: "Primeiro ano inválido"
    })
  }

  first_year = Number(first_year.toString());

  let second_year = req.body.secondYear;

  if(second_year === undefined){
    return res.status(400).json({
      message: "Segundo ano inválido"
    })
  }

  second_year = Number(second_year.toString());

  if(first_year > second_year){
    return res.status(400).json({
      message: "O segundo ano deve ser posterior ou igual ao primeiro ano"
    })
  }

  let first_month = req.body.firstMonth;

  if(first_month === undefined){
    return res.status(400).json({
      message: "Primeiro mês inválido"
    })
  }

  first_month = Number(first_month.toString());

  let second_month = req.body.secondMonth;

  if(second_month === undefined){
    return res.status(400).json({
      message: "Segundo mês inválido"
    })
  }

  second_month = Number(second_month.toString());

  if(first_month > second_month && first_year === second_year){
    return res.status(400).json({
      message: "O segundo mês deve ser posterior ou igual ao primeiro mês"
    })
  }

  let report = await controller.get_corretora_monthly_compare(corr_id, first_year, first_month, second_year, second_month);

  res.status(200).json({
    report: report
  });
});

router.post ('/corretoras/:id/compare/yearly', async (req,res) => {
  let corr_id = req.params.id;

  if(corr_id === undefined){
    return res.status(400).json({
      message: "Corretora inválida"
    })
  }

  let first_year = req.body.firstYear;

  if(first_year === undefined){
    return res.status(400).json({
      message: "Primeiro ano inválido"
    })
  }

  first_year = Number(first_year.toString());

  let second_year = req.body.secondYear;

  if(second_year === undefined){
    return res.status(400).json({
      message: "Segundo ano inválido"
    })
  }

  second_year = Number(second_year.toString());

  if(first_year > second_year){
    return res.status(400).json({
      message: "O segundo ano deve ser posterior ou igual ao primeiro ano"
    })
  }

  let report = await controller.get_corretora_yearly_compare(corr_id, first_year, second_year);

  res.status(200).json({
    report: report
  });
});

module.exports = router;
