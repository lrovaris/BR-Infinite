const db = require('./db');
let cache = require('../memoryCache');

async function get_produtos() {
  let all_produtos = cache.get('produtos');

  if(all_produtos !== undefined){
    return all_produtos;
  }else {
    all_produtos = await db.get_produtos();
    return all_produtos;
  }
}

module.exports = { get_produtos };
