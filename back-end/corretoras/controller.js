const db = require('./db');
let cache = require('../memoryCache');

async function get_corretoras() {
  let all_corretoras = cache.get('corretoras');

  if(all_corretoras !== undefined){
    return all_corretoras;
  }else {
    all_corretoras = await db.get_corretoras();
    return all_corretoras;
  }
}

async function get_corretora_by_id(corr_id) {
  let all_corr = await get_corretoras();

  let corretora = all_corr.filter(corr_obj =>{
    return (corr_obj._id.toString() == corr_id.toString());
  })[0];

  return corretora;
}

module.exports = { get_corretoras, get_corretora_by_id };
