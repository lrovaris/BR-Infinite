const default_controller = require('../../defaultController')
const date_utils = require('../../../utils/dateUtils')
const corretora_controller = require('../../../../corretoras/controller')

async function get_seguradora_monthly_compare(seg_id, first_year, first_month, second_year, second_month){

  let all_prods = await default_controller.get_entries();

  let seg_prods = all_prods.filter(prod => prod.seguradora === seg_id)

  let this_corrs = await corretora_controller.get_corretoras_by_seguradora(seg_id);

  let total_var = 0;


  let this_report = this_corrs.map(corr => {
    let this_corr_prod = seg_prods.filter(prod => prod.corretora.toString() === corr._id.toString())

    let this_corr_report = []

    let first_month_prod = this_corr_prod.filter(prod => {

      let prod_date = date_utils.getDateInfoFromString(prod.date)

      if(prod_date.year !== first_year){
        return false
      }

      if(prod_date.month !== first_month){
        return false
      }

      return true
    }).sort((prod_a, prod_b) =>{
      return date_utils.getDateInfoFromString(prod_b.date).day - date_utils.getDateInfoFromString(prod_a.date).day
    })[0]

    let first_date_string = `${first_month}/${first_year}`

    if(first_month_prod !== undefined){
      this_corr_report.push({
        "date":first_date_string,
        "total":first_month_prod.total,
        "warning": false
      })
    }else {
      this_corr_report.push({
        "date":first_date_string,
        "total":0,
        "warning": true
      })
    }

    let second_month_prod = this_corr_prod.filter(prod => {

      let prod_date = date_utils.getDateInfoFromString(prod.date)

      if(prod_date.year !== second_year){
        return false
      }

      if(prod_date.month !== second_month){
        return false
      }

      return true
    }).sort((prod_a, prod_b) =>{
      return date_utils.getDateInfoFromString(prod_b.date).day - date_utils.getDateInfoFromString(prod_a.date).day
    })[0]

    let second_date_string = `${second_month}/${second_year}`

    if(second_month_prod !== undefined){
      this_corr_report.push({
        "date":second_date_string,
        "total":second_month_prod.total,
        "warning": false
      })
    }else {
      this_corr_report.push({
        "date":second_date_string,
        "total":0,
        "warning": true
      })
    }

    let this_var = this_corr_report[1].total / this_corr_report[0].total

    total_var += this_var;


    return {
      corretora: corr.name,
      var: this_var,
      corr_report: this_corr_report
    };
  })

  let this_var_media = total_var / this_report.length;

  return {
    var_media: this_var_media,
    report: this_report
  }
}

module.exports = { get_seguradora_monthly_compare };
