const default_controller = require('../defaultController')
const date_utils = require('../../utils/dateUtils')

async function get_seguradora_dates(seg_id){
  let all_prods = await default_controller.get_entries();

  let this_seg_prods = all_prods.filter(prod => prod.seguradora === seg_id)

  return date_utils.createYearsObjectFromProduction(this_seg_prods);
}


module.exports = {
  get_seguradora_dates
};
