const default_controller = require('../defaultController')
const date_utils = require('../../utils/dateUtils')
const corretora_controller = require('../../../corretoras/controller')
const seguradora_controller = require('../../../seguradoras/controller')
const date_prod_controller = require('../dateController')

const { get_seguradora_daily_report } = require('./seguradoraReport/seguradoraDailyReport');
const { get_seguradora_monthly_report } = require('./seguradoraReport/seguradoraMonthlyReport');
const { get_seguradora_yearly_report } = require('./seguradoraReport/seguradoraYearlyReport');

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
