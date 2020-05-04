const db = require('./db');
let cache = require('../memoryCache');

async function get_opportunities() {
  let all_opportunities = cache.get('opportunities');

  if(all_opportunities !== undefined){
    return all_opportunities;
  }else {
    all_opportunities = await db.get_opportunities();
    return all_opportunities;
  }
}

async function get_opportunity_by_id(opp_id) {
  let all_opp = await get_opportunities();

  let opportunity = all_opp.filter(opp_obj =>{
    return (opp_obj._id.toString() == opp_id.toString());
  })[0];

  return opportunity;
}

module.exports = { get_opportunities, get_opportunity_by_id };
