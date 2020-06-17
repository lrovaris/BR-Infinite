const default_controller = require('../../defaultController')
const date_utils = require('../../../utils/dateUtils')
const corretora_controller = require('../../../../corretoras/controller')
const seguradora_controller = require('../../../../seguradoras/controller')

async function get_corretora_daily_compare(corr_id, first_year, first_month, first_day, second_year, second_month, second_day){
  let all_prods = await default_controller.get_entries();

  let corr_prods = all_prods.filter(prod => prod.corretora === corr_id)

  let this_corr = await corretora_controller.get_corretora_by_id(corr_id)

  let this_segs = await seguradora_controller.get_seguradoras_by_id_array(this_corr.seguradoras)

  let total_var = 0;

  let this_report = this_segs.map(this_seguradora => {
    let this_seg_prod = corr_prods.filter(prod => prod.seguradora.toString() === this_seguradora._id.toString())

    let this_seg_report = []

    let first_day_prod = this_seg_prod.find(prod => {

      let prod_date = date_utils.getDateInfoFromString(prod.date)

      if(prod_date.year !== first_year){
        return false
      }

      if(prod_date.month !== first_month){
        return false
      }

      if(prod_date.day !== first_day){
        return false
      }

      return true
    })

    let first_date_string = `${first_day}/${first_month}/${first_year}`

    if(first_day_prod !== undefined){
      this_seg_report.push({
        "date":first_date_string,
        "total":first_day_prod.total,
        "warning": false
      })
    }else {
      this_seg_report.push({
        "date":first_date_string,
        "total":0,
        "warning": true
      })
    }


    let second_day_prod = this_seg_prod.find(prod => {

      let prod_date = date_utils.getDateInfoFromString(prod.date)

      if(prod_date.year !== second_year){
        return false
      }

      if(prod_date.month !== second_month){
        return false
      }

      if(prod_date.day !== second_day){
        return false
      }

      return true
    })

    let second_date_string = `${second_day}/${second_month}/${second_year}`

    if(second_day_prod !== undefined){
      this_seg_report.push({
        "date":second_date_string,
        "total":second_day_prod.total,
        "warning": false
      })
    }else {
      this_seg_report.push({
        "date":second_date_string,
        "total":0,
        "warning": true
      })
    }

    let this_var = this_seg_report[1].total / this_seg_report[0].total

    total_var += this_var;


    return {
      seguradora: this_seguradora.name,
      var: this_var,
      seg_report: this_seg_report
    };
  })

  let this_var_media = total_var / this_report.length;

  return {
    var_media: this_var_media,
    report: this_report
  }
}

module.exports = {
  get_corretora_daily_compare
}
