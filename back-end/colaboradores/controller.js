const db = require('./db');
let cache = require('../memoryCache');

async function get_colaboradores() {
  let all_colaboradores = cache.get('colaboradores');

  if(all_colaboradores !== undefined){
    return all_colaboradores;
  }else {
    all_colaboradores = await db.get_colaboradores();


    return all_colaboradores;
  }
}

module.exports = { get_colaboradores };
