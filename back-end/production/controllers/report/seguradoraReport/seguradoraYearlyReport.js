const default_controller = require('../../defaultController')
const date_utils = require('../../../utils/dateUtils')
const corretora_controller = require('../../../../corretoras/controller')
const seguradora_controller = require('../../../../seguradoras/controller')
const date_prod_controller = require('../../dateController')

async function get_seguradora_yearly_report(seg_id, begin_year, end_year){

  let all_prods = await default_controller.get_entries();

  let this_period_seg_prods = all_prods.filter(prod => {
    let date_info = date_utils.getDateInfoFromString(prod.date);

    if (date_info.year < begin_year){
      return false
    }

    if (date_info.year > end_year){
      return false
    }

    return (prod.seguradora === seg_id)
  })

  let this_prod_dates = date_utils.createYearsObjectFromProduction(this_period_seg_prods)


  let this_years_array = Object.entries(this_prod_dates)

  let this_corrs = await corretora_controller.get_corretoras_by_seguradora(seg_id);

  let this_total = 0;



  let this_report = this_corrs.map(corr => {
    let this_corr_prod = this_period_seg_prods.filter(prod => prod.corretora.toString() === corr._id.toString())

    let this_corr_report = []

    let corr_total = 0;

    for (var i = 0; i < this_years_array.length; i++) {
      let current_year = this_years_array[i][0];


      let year_report = {
        date: `${current_year}`,
        total: 0,
        warning: true
      }


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

        year_report.total += total;
      }

      this_total += year_report.total;
      corr_total += year_report.total;

      if(year_report.total !== 0){
        year_report.warning = false;
      }

      this_corr_report.push(year_report)
    }

    return {
      corretora: corr.name,
      corr_report: this_corr_report,
      corr_total: corr_total
    };
  });

  return {
    total: this_total,
    report: this_report
  }
}

module.exports = { get_seguradora_yearly_report };
