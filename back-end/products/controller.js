const db = require('./db');
let cache = require('../memoryCache');

async function get_produtos() {
  return cache.get('produtos') || await db.get_produtos();
}

async function get_produto_by_id(prod_id) {
  let all_prod = await get_produtos();

  let produto = all_prod.find(prod_obj => prod_obj._id.toString() == prod_id.toString());

  return produto;
}

async function register_produto(new_prod) {
  let db_prod = await db.register_produto(new_prod).catch(err => logger.error(err));

  return db_prod.ops[0];
}

function validate_produto(new_produto) {

  if (new_produto === undefined){
    return{
      "valid": false,
      "message": "Produto Inválido"
    }
  }

  if (!new_produto.name){
    return {
      "valid": false,
      "message": "Campo de nome vazio"
    };
  }

  if (!new_produto.description){
    return {
      "valid": false,
      "message": "Campo de descrição vazio"
    };
  }

  if (!new_produto.seguradoras){
    return {
      "valid": false,
      "message": "Nenhuma seguradora selecionada"
    };
  }

  return {"valid":true};

}

module.exports = { get_produtos, get_produto_by_id, register_produto, validate_produto };
