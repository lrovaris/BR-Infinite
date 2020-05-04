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

async function get_produto_by_id(prod_id) {
  let all_prod = await get_produtos();

  let produto = all_prod.filter(prod_obj =>{
    return (prod_obj._id.toString() == prod_id.toString());
  })[0];

  return produto;
}

module.exports = { get_produtos, get_produto_by_id };
