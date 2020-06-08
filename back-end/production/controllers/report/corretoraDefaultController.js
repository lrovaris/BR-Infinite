const default_controller = require('../defaultController')
const date_utils = require('../../utils/dateUtils')

async function get_corretora_dates(corr_id){
  let all_prods = await default_controller.get_entries();

  let this_corr_prods = all_prods.filter(prod => prod.corretora === corr_id)

  return date_utils.createYearsObjectFromProduction(this_corr_prods);
}


module.exports = {
  get_corretora_dates
};
