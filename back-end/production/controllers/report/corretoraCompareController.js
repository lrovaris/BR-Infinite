const default_controller = require('../defaultController')
const date_utils = require('../../utils/dateUtils')
const corretora_controller = require('../../../corretoras/controller')
const seguradora_controller = require('../../../seguradoras/controller')


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

async function get_corretora_monthly_compare(corr_id, first_year, first_month, second_year, second_month){

  let all_prods = await default_controller.get_entries();

  let corr_prods = all_prods.filter(prod => prod.corretora === corr_id)

  let this_corr = await corretora_controller.get_corretora_by_id(corr_id)

  let this_segs = await seguradora_controller.get_seguradoras_by_id_array(this_corr.seguradoras)

  let total_var = 0;


  let this_report = this_segs.map(this_seguradora => {
    let this_seg_prod = corr_prods.filter(prod => prod.seguradora.toString() === this_seguradora._id.toString())

    let this_seg_report = []

    let first_month_prod = this_seg_prod.filter(prod => {

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
      this_seg_report.push({
        "date":first_date_string,
        "total":first_month_prod.total,
        "warning": false
      })
    }else {
      this_seg_report.push({
        "date":first_date_string,
        "total":0,
        "warning": true
      })
    }

    let second_month_prod = this_seg_prod.filter(prod => {

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
      this_seg_report.push({
        "date":second_date_string,
        "total":second_month_prod.total,
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

async function get_corretora_yearly_compare(corr_id, first_year, second_year){

  let all_prods = await default_controller.get_entries();

  let corr_prods = all_prods.filter(prod => prod.corretora === corr_id)

  let this_corr = await corretora_controller.get_corretora_by_id(corr_id)

  let this_segs = await seguradora_controller.get_seguradoras_by_id_array(this_corr.seguradoras)

  let total_var = 0;

  let this_report = this_segs.map(this_seguradora => {
    let this_seg_prod = corr_prods.filter(prod => prod.seguradora.toString() === this_seguradora._id.toString())

    let this_prod_dates = date_utils.createYearsObjectFromProduction(this_seg_prod)

    let this_seg_report = []

    // catar o último dia de cada mês do ano

    let first_year_prod = {
      date: `${first_year}`,
      total: 0,
      warning: false
    }


    if(this_prod_dates[first_year] !== undefined){
      let first_year_months = Object.entries(this_prod_dates[first_year])

      for (var i = 0; i < first_year_months.length; i++) {
      let current_month = Number(first_year_months[i][0])

      let month_prod = this_seg_prod.filter(prod => {

        let prod_date = date_utils.getDateInfoFromString(prod.date)

        if(prod_date.year !== first_year){
          return false
        }

        if(prod_date.month !== current_month){
          return false
        }

        return true
      }).sort((prod_a, prod_b) =>{
        return date_utils.getDateInfoFromString(prod_b.date).day - date_utils.getDateInfoFromString(prod_a.date).day
      })[0]

      if(month_prod !== undefined){
        first_year_prod.total += month_prod.total
      }
    }
    }


    if(first_year_prod.total === 0){
      first_year_prod.warning = true
    }

    this_seg_report.push(first_year_prod)

    let second_year_prod = {
      date: `${second_year}`,
      total: 0,
      warning: false
    }


    if(this_prod_dates[second_year] !== undefined){
      let second_year_months = Object.entries(this_prod_dates[second_year])

      for (var i = 0; i < second_year_months.length; i++) {
      let current_month = Number(second_year_months[i][0])

      let month_prod = this_seg_prod.filter(prod => {

        let prod_date = date_utils.getDateInfoFromString(prod.date)

        if(prod_date.year !== second_year){
          return false
        }

        if(prod_date.month !== current_month){
          return false
        }

        return true
      }).sort((prod_a, prod_b) =>{
        return date_utils.getDateInfoFromString(prod_b.date).day - date_utils.getDateInfoFromString(prod_a.date).day
      })[0]

      if(month_prod !== undefined){
        second_year_prod.total += month_prod.total
      }
    }
    }

    if(second_year_prod.total === 0){
      second_year_prod.warning = true
    }

    this_seg_report.push(second_year_prod)

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
  get_corretora_daily_compare,
  get_corretora_monthly_compare,
  get_corretora_yearly_compare
};
