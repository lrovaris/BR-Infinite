const db = require('../db');
let cache = require('../../memoryCache');

async function get_opportunities() {
  return cache.get('opportunities') || await db.get_opportunities();
}

async function get_opportunity_by_id(opp_id) {
  let all_opp = await get_opportunities();

  let opportunity = all_opp.find(opp_obj =>{
    return (opp_obj._id.toString() == opp_id.toString());
  });

  return opportunity;
}


module.exports = {
  get_opportunities,
  get_opportunity_by_id
};
