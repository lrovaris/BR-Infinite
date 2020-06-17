const default_controller = require('../../defaultController')
const date_utils = require('../../../utils/dateUtils')
const corretora_controller = require('../../../../corretoras/controller')
const seguradora_controller = require('../../../../seguradoras/controller')
const date_prod_controller = require('../../dateController')

async function get_corretora_daily_report(corr_id, report_year, report_month) {
  let all_prods = await default_controller.get_entries();

  let this_month_corr_prods = all_prods.filter(prod => {
    return (
      date_utils.getDateInfoFromString(prod.date).year === report_year
      && date_utils.getDateInfoFromString(prod.date).month === report_month
      && prod.corretora === corr_id
    )
  })

  let this_month_days = date_utils.createYearsObjectFromProduction(this_month_corr_prods)[report_year][report_month]

  let this_corr = await corretora_controller.get_corretora_by_id(corr_id)

  let this_segs = await seguradora_controller.get_seguradoras_by_id_array(this_corr.seguradoras)

  let this_report = this_segs.map(this_seguradora => {
    let this_seg_prod = this_month_corr_prods.filter(prod => prod.seguradora.toString() === this_seguradora._id.toString())

    let this_seg_report = this_month_days.map(this_day => {
      let total;
      let warning = true;

      let this_prod = this_seg_prod.find(prod => date_utils.getDateInfoFromString(prod.date).day === this_day);

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
      seguradora: this_seguradora.name,
      seg_report: this_seg_report
    };
  })


  let day_num = this_month_days.length
  let this_total = 0;

  for (var i = 0; i < this_report.length; i++) {
    let seg_report = this_report[i].seg_report;

    let ordered_seg_report = seg_report.sort((rep_a, rep_b) => {
      return rep_a.date - rep_b.date
    })

    if(!ordered_seg_report[ordered_seg_report.length-1].warning){
      this_total += ordered_seg_report[ordered_seg_report.length-1].total
    }

  }

  let this_media = (this_total / day_num).toFixed()

  let ordered_month_days = this_month_days.sort((day_a, day_b) =>{
    return day_a - day_b
  })

  let util_days = await date_prod_controller.get_day_number_by_date(report_year, report_month)

  let this_projection =  ( this_total + ( ( util_days - day_num) * this_media ) ).toFixed()



  return {
    total: this_total,
    media: this_media,
    projection: this_projection,
    report: this_report
  };
}

module.exports = { get_corretora_daily_report }
