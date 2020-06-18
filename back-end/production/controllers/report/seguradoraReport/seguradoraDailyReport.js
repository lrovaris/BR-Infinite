const default_controller = require('../../defaultController')
const date_utils = require('../../../utils/dateUtils')
const corretora_controller = require('../../../../corretoras/controller')
const seguradora_controller = require('../../../../seguradoras/controller')
const date_prod_controller = require('../../dateController')

const fs = require('fs');
const csv = require('fast-csv');

async function get_seguradora_daily_report(seg_id, report_year, report_month) {
  let all_prods = await default_controller.get_entries();

  let this_month_seg_prods = all_prods.filter(prod => {
    return (
      date_utils.getDateInfoFromString(prod.date).year === report_year
      && date_utils.getDateInfoFromString(prod.date).month === report_month
      && prod.seguradora === seg_id
    )
  })

  let this_month_days = date_utils.createYearsObjectFromProduction(this_month_seg_prods)[report_year][report_month]

  let this_corrs = await corretora_controller.get_corretoras_by_seguradora(seg_id);

  let this_report = this_corrs.map(corr => {
    let this_corr_prod = this_month_seg_prods.filter(prod => prod.corretora.toString() === corr._id.toString())

    let this_corr_report = this_month_days.map(this_day => {
      let total;
      let warning = true;

      let this_prod = this_corr_prod.find(prod => date_utils.getDateInfoFromString(prod.date).day === this_day);

      if(this_prod !== undefined){
        total = this_prod.total;
        warning = false;
      }

      return{
        date: this_day,
        total: total,
        warning: warning
      }
    });

    return {
      corretora: corr.name,
      corr_report: this_corr_report
    };
  });

  let day_num = this_month_days.length
  let this_total = 0;

  for (var i = 0; i < this_report.length; i++) {
    let corr_report = this_report[i].corr_report;

    let ordered_corr_report = corr_report.sort((rep_a, rep_b) => {
      return rep_a.date - rep_b.date
    })

    if(!ordered_corr_report[ordered_corr_report.length-1].warning){
      this_total += ordered_corr_report[ordered_corr_report.length-1].total
    }

  }

  let this_media = (this_total / day_num).toFixed()

  let util_days = await date_prod_controller.get_day_number_by_date(report_year, report_month)

  let this_projection =  ( this_total + ( ( util_days - day_num) * this_media ) ).toFixed()

  return {
    total: this_total,
    media: this_media,
    projection: this_projection,
    report: this_report
  };
}

async function get_seguradora_daily_report_csv(seg_id, report_year, report_month, callback) {
  let all_prods = await default_controller.get_entries();

  let this_month_seg_prods = all_prods.filter(prod => {
    return (
      date_utils.getDateInfoFromString(prod.date).year === report_year
      && date_utils.getDateInfoFromString(prod.date).month === report_month
      && prod.seguradora === seg_id
    )
  })

  let this_month_days = date_utils.createYearsObjectFromProduction(this_month_seg_prods)[report_year][report_month]

  this_month_days = this_month_days.sort((day_a, day_b) =>{
    return day_a - day_b
  })

  let this_corrs = await corretora_controller.get_corretoras_by_seguradora(seg_id);

  let my_csv = [];

  // primeiro valor = header

  let csv_header = []

  csv_header.push("Corretora")
  csv_header.push("Média")
  csv_header.push("Projeção")

  for (var i = 0; i < this_month_days.length; i++) {
    csv_header.push(this_month_days[i])
  }

  my_csv.push(csv_header);

  // cada outro = uma corretora diferente

  let this_report = await Promise.all(this_corrs.map( async corr => {
    let csv_line = []

    csv_line.push(corr.name)

    let this_corr_prod = this_month_seg_prods.filter(prod => prod.corretora.toString() === corr._id.toString())

    let this_total = 0;

    for (var i = 0; i < this_month_days.length; i++) {
      let this_prod = this_corr_prod.find(prod => date_utils.getDateInfoFromString(prod.date).day === this_month_days[i]);

      if(this_prod !== undefined){
        this_total = this_prod.total
      }
    }

    let this_media = (this_total / this_month_days.length).toFixed();

    csv_line.push(this_media)

    let util_days = await date_prod_controller.get_day_number_by_date(report_year, report_month)

    let this_projection =  ( this_total + ( ( util_days - this_month_days.length) * this_media ) ).toFixed()

    csv_line.push(this_projection)

    for (var i = 0; i < this_month_days.length; i++) {
      let this_prod = this_corr_prod.find(prod => date_utils.getDateInfoFromString(prod.date).day === this_month_days[i]);

      if(this_prod !== undefined){
        csv_line.push(this_prod.total)
      }else {
        csv_line.push("produção ausente")
      }
    }

    my_csv.push(csv_line);

    return corr;
  })
)

let this_seguradora = await seguradora_controller.get_seguradora_by_id(seg_id);

let path = `${this_seguradora.name}-${report_year}-${report_month}.csv`

let ws = fs.createWriteStream(`./relatorios/${path}`)

csv
  .write(my_csv, {headers: true})
  .pipe(ws)
  .on('close', () => {
    callback({
      valid: true,
      path: path
    })
  })
  .on('error', () => {
    callback({
      valid: false
    })
  })
}

module.exports = { get_seguradora_daily_report, get_seguradora_daily_report_csv };
