const db = require('./db');
let cache = require('../memoryCache');

const seguradora_controller = require('../seguradoras/controller')

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

  if (!new_produto.seguradoras){
    return {
      "valid": false,
      "message": "Nenhuma seguradora selecionada"
    };
  }

  return {"valid":true};

}


async function get_filtered_produtos(filter_params) {

  for (var i = 0; i < filter_params.length; i++) {
    if(filter_params[i].type !== "name" && filter_params[i].type !== "seguradoras"){
      return{
        valid: false,
        message: `Tipo ${filter_params[i].type} não identificado`
      }
    }
  }

  const all_produtos = await get_produtos()
  const all_seguradoras = await seguradora_controller.get_seguradoras();

  let filtered_produtos = all_produtos.filter(prod_obj => {

    for (var i = 0; i < filter_params.length; i++) {
      if (filter_params[i].value === "" || filter_params[i].value === " "){
        continue;
      }

      if (filter_params[i].type === "name"){

        if(!prod_obj.name.toLowerCase().includes(filter_params[i].value.toLowerCase())){
          return false
        }
      }

      if(filter_params[i].type === "seguradoras"){

        if (prod_obj.seguradoras === undefined){
          return false;
        }

        let this_segs = prod_obj.seguradoras.map(seg_id => {


          let seguradora = all_seguradoras.find(seg_obj =>{
            return (seg_obj._id.toString() == seg_id.toString())
          })

          if(seguradora === undefined){
            return undefined
          }

          return seguradora.name

        })

        let includes = false;

        for (var i = 0; i < this_segs.length; i++) {

          if(this_segs[i] === undefined){
            continue;
          }

          if(this_segs[i].toLowerCase().includes(filter_params[i].value.toLowerCase())){
            includes = true
          }
        }

        if(!includes){
          return false;
        }

      }
    }

    return true
  })

  return{
    valid: true,
    data: filtered_produtos
  }
}



module.exports = {
  get_produtos,
  get_produto_by_id,
  register_produto,
  validate_produto,
  get_filtered_produtos
};
