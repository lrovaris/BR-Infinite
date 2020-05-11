const db = require('./db');
let cache = require('../memoryCache');

async function get_colaboradores() {
  return cache.get('colaboradores') || await db.get_colaboradores();
}

async function get_colaboradores_by_id(colab_id) {
  let all_colab = await get_colaboradores();

  let colaborador = all_colab.find(colab_obj =>{
    return (colab_obj._id.toString() == colab_id.toString())
  });

  return colaborador;
}

async function get_colaboradores_corretora(id_corretora, id_manager){
  let all_colab = await get_colaboradores();

  let this_corretora_colabs = all_colab.filter(colab_obj =>{
    if(colab_obj.corretora+"" == "" || colab_obj.corretora == undefined){
      return false;
    }

    return ((colab_obj.corretora.toString() == id_corretora.toString()) && !(colab_obj._id.toString() == id_manager.toString()) && colab_obj.active)
  });

  let this_corr_manager = await get_colaboradores_by_id(id_manager);

  return {
    colaboradores: this_corretora_colabs,
    manager: this_corr_manager
  };
}

async function get_colaboradores_seguradora(id_seguradora, id_manager){
  let all_colab = await get_colaboradores();

  let this_seguradora_colabs = all_colab.filter(colab_obj =>{
    if(colab_obj.seguradora+"" == "" || colab_obj.seguradora == undefined){
      return false;
    }

    return ((colab_obj.seguradora.toString() == id_seguradora.toString()) && !(colab_obj._id.toString() == id_manager.toString()) && colab_obj.active)
  });

  let this_seg_manager = await get_colaboradores_by_id(id_manager);

  return {
    colaboradores: this_seguradora_colabs,
    manager: this_seg_manager
  };
}

function validate_colaborador(colaborador){
  if (colaborador === undefined){
    return{
      "valid": false,
      "message": "Colaborador inválido"
    }
  }

  if (!colaborador.name){
    return {
      "valid": false,
      "message":"Campo de nome do colaborador vazio"
    };
  }

  if (!colaborador.telephone){
    return {
      "valid": false,
      "message":"Campo de telefone do colaborador vazio"
    };
  }

  if (!colaborador.email){
    return {
      "valid": false,
      "message":"Campo de email do colaborador vazio"
    };
  }

  if (!colaborador.birthday){
    return {
      "valid": false,
      "message":"Campo de aniversário vazio"
    };
  }

  if (!colaborador.job){
    return {
      "valid": false,
      "message":"Campo de cargo vazio"
    };
  }

  return{ valid: true }
}

async function register_colaborador(new_colab){
  let db_colab = await db.register_colaborador(new_colab).catch(err => console.error(err));

  return db_colab.ops[0];
}

module.exports = {
  get_colaboradores,
  get_colaboradores_by_id,
  get_colaboradores_corretora,
  get_colaboradores_seguradora,
  validate_colaborador,
  register_colaborador
};
