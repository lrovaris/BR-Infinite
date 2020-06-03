const default_controller = require('./defaultController')
const date_utils = require('../utils/dateUtils')
const corretora_controller = require('../../corretoras/controller')

async function get_seguradora_dates(seg_id){
  let all_prods = await default_controller.get_entries();

  let this_seg_prods = all_prods.filter(prod => prod.seguradora === seg_id)

  return date_utils.createYearsObjectFromProduction(this_seg_prods);
}

async function get_seguradora_month_report(seg_id, report_year, report_month) {
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

    this_corr_report = this_month_days.map(this_day => {
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

  let ordered_month_days = this_month_days.sort((day_a, day_b) =>{
    return day_a - day_b
  })

  let this_projection =  (this_total + (((( 30 - ordered_month_days[day_num - 1]) * 2) / 3) * this_media)).toFixed()

  return {
    total: this_total,
    media: this_media,
    projection: this_projection,
    report: this_report
  };
}


module.exports = {
  get_seguradora_month_report,
  get_seguradora_dates
};
