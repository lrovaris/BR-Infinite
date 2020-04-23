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

module.exports = { get_corretoras };
