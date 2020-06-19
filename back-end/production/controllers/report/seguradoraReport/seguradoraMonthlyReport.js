const default_controller = require('../../defaultController')
const date_utils = require('../../../utils/dateUtils')
const corretora_controller = require('../../../../corretoras/controller')
const seguradora_controller = require('../../../../seguradoras/controller')
const date_prod_controller = require('../../dateController')

const fs = require('fs');
const csv = require('fast-csv');

async function get_seguradora_monthly_report(seg_id, begin_year, begin_month, end_year, end_month){

  let all_prods = await default_controller.get_entries();

  let this_period_seg_prods = all_prods.filter(prod => {
    let date_info = date_utils.getDateInfoFromString(prod.date);

    if (date_info.year < begin_year){
      return false
    }

    if (date_info.year > end_year){
      return false
    }

    if(date_info.month < begin_month && date_info.year === begin_year){
      return false
    }

    if(date_info.month > end_month && date_info.year === end_year){
      return false
    }

    return (prod.seguradora === seg_id)
  })

  let this_prod_dates = date_utils.createYearsObjectFromProduction(this_period_seg_prods)


  let this_years_array = Object.entries(this_prod_dates)

  // this_years_array[i] => [ano, obj com meses]
  // this_years_array[i][0] => ano
  // this_years_array[i][1] => obj com meses

  let this_corrs = await corretora_controller.get_corretoras_by_seguradora(seg_id);

  let this_total = 0;

  let this_report = this_corrs.map(corr => {
    let this_corr_prod = this_period_seg_prods.filter(prod => prod.corretora.toString() === corr._id.toString())

    let this_corr_report = []


    for (var i = 0; i < this_years_array.length; i++) {
      let current_year = this_years_array[i][0];

      let month_array = Object.entries(this_years_array[i][1]).map(([month, day_array]) => month)

      for (var j = 0; j < month_array.length; j++) {
        let current_month = month_array[j];

        let month_day_array = this_years_array[i][1][current_month].sort((day_a, day_b) =>{
          return day_b - day_a
        });

        let total = 0;
        let warning = true;

        let this_prod = this_corr_prod.find(prod => {
          let prod_date = date_utils.getDateInfoFromString(prod.date);

          if(prod_date.year !== Number(current_year)){
            return false
          }

          if(prod_date.month !== Number(current_month)){
            return false
          }

          return (prod_date.day === Number(month_day_array[0]))
        });


        if(this_prod !== undefined){
          total = this_prod.total;
          warning = false;
        }

        this_total += total;

        let month_str = (current_month < 10) ? ("0" + current_month.toString()) : current_month.toString()

        this_corr_report.push({
          date: `${month_str}/${current_year}`,
          total: total,
          warning: warning
        })
      }
    }

    return {
      corretora: corr.name,
      corr_report: this_corr_report
    };
  });


  return {
    total: this_total,
    report: this_report
  }
}

async function get_seguradora_monthly_report_csv(seg_id, begin_year, begin_month, end_year, end_month, callback){

  let all_prods = await default_controller.get_entries();

  let this_period_seg_prods = all_prods.filter(prod => {
    let date_info = date_utils.getDateInfoFromString(prod.date);

    if (date_info.year < begin_year){
      return false
    }

    if (date_info.year > end_year){
      return false
    }

    if(date_info.month < begin_month && date_info.year === begin_year){
      return false
    }

    if(date_info.month > end_month && date_info.year === end_year){
      return false
    }

    return (prod.seguradora === seg_id)
  })

  let this_prod_dates = date_utils.createYearsObjectFromProduction(this_period_seg_prods)


  let this_years_array = Object.entries(this_prod_dates)

  // this_years_array[i] => [ano, obj com meses]
  // this_years_array[i][0] => ano
  // this_years_array[i][1] => obj com meses

  let this_corrs = await corretora_controller.get_corretoras_by_seguradora(seg_id);

  let this_total = 0;

  let this_report = this_corrs.map(corr => {
    let this_corr_prod = this_period_seg_prods.filter(prod => prod.corretora.toString() === corr._id.toString())

    let this_corr_report = []


    for (var i = 0; i < this_years_array.length; i++) {
      let current_year = this_years_array[i][0];

      let month_array = Object.entries(this_years_array[i][1]).map(([month, day_array]) => month)

      for (var j = 0; j < month_array.length; j++) {
        let current_month = month_array[j];

        let month_day_array = this_years_array[i][1][current_month].sort((day_a, day_b) =>{
          return day_b - day_a
        });

        let total = 0;
        let warning = true;

        let this_prod = this_corr_prod.find(prod => {
          let prod_date = date_utils.getDateInfoFromString(prod.date);

          if(prod_date.year !== Number(current_year)){
            return false
          }

          if(prod_date.month !== Number(current_month)){
            return false
          }

          return (prod_date.day === Number(month_day_array[0]))
        });


        if(this_prod !== undefined){
          total = this_prod.total;
          warning = false;
        }

        this_total += total;

        let month_str = (current_month < 10) ? ("0" + current_month.toString()) : current_month.toString()

        this_corr_report.push({
          date: `${month_str}/${current_year}`,
          total: total,
          warning: warning
        })
      }
    }

    return {
      corretora: corr.name,
      corr_report: this_corr_report
    };
  });


  return {
    total: this_total,
    report: this_report
  }
}


module.exports = { get_seguradora_monthly_report, get_seguradora_monthly_report_csv };
