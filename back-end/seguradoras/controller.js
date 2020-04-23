const db = require('./db');
let cache = require('../memoryCache');

async function get_seguradoras() {
  let all_seguradoras = cache.get('seguradoras');

  if(all_seguradoras !== undefined){
    return all_seguradoras;
  }else {
    all_seguradoras = await db.get_seguradoras();
    return all_seguradoras;
  }
}

module.exports = { get_seguradoras };
