const default_controller = require('../defaultController')
const date_utils = require('../../utils/dateUtils')
const corretora_controller = require('../../../corretoras/controller')
const seguradora_controller = require('../../../seguradoras/controller')

const date_prod_controller = require("../dateController")

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

async function get_seguradora_home_reports(){
  let all_prods = await default_controller.get_entries();

  let all_segs = await seguradora_controller.get_seguradoras();

  let this_report =  await Promise.all(
    all_segs.map(async this_seguradora =>{

     let seg_prods = all_prods.filter(prod => prod.seguradora === this_seguradora._id.toString())

     let date_obj = await date_utils.createYearsObjectFromProduction(seg_prods)

     let year_obj = date_obj[(new Date().getFullYear()).toString()]

     let this_month_days = [ "" ]
     if(year_obj !== undefined){
       this_month_days = [(new Date().getMonth() + 1).toString()];
     }

     let this_corrs = await corretora_controller.get_corretoras_by_seguradora(this_seguradora._id.toString());

     let this_name = this_seguradora.name;

     let this_total = 0;

     for (var i = 0; i < this_corrs.length; i++) {
       let this_corretora = this_corrs[i];

       let this_corr_prod = seg_prods.filter(prod => prod.corretora.toString() === this_corretora._id.toString())

       let this_month_corr_prod = this_corr_prod.filter(prod => {

         let prod_date = date_utils.getDateInfoFromString(prod.date)

         if(prod_date.year !== new Date().getFullYear()){
           return false
         }

         if(prod_date.month !== (new Date().getMonth() + 1)){
           return false
         }

         return true
       }).sort((prod_a, prod_b) =>{
         return date_utils.getDateInfoFromString(prod_b.date).day - date_utils.getDateInfoFromString(prod_a.date).day
       })[0]

       if(this_month_corr_prod !== undefined){
         this_total += this_month_corr_prod.total
       }
     }

     let this_media = (this_total / this_month_days.length).toFixed()

     let ordered_month_days = this_month_days.sort((day_a, day_b) =>{
       return day_a - day_b
     })

     let util_days = await date_prod_controller.get_day_number_by_date(new Date().getFullYear(), (new Date().getMonth() + 1))

     let this_projection =  ( this_total + ( ( util_days - this_month_days.length) * this_media ) ).toFixed()

     return{
       total: this_total,
       name: this_name,
       media: this_media,
       projection: this_projection
     }
   })
  )

  return {
    report: this_report
  }
}

module.exports = {
  get_seguradora_daily_report,
  get_seguradora_monthly_report,
  get_seguradora_yearly_report,
  get_seguradora_home_reports
};
