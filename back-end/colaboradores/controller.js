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

async function get_colaboradores_by_id(colab_id) {
  let all_colab = await get_colaboradores();

  let colaborador = all_colab.filter(colab_obj =>{
    return (colab_obj._id.toString() == colab_id.toString())
  })[0];

  return colaborador;
}

async function get_colaboradores_corretora(id_corretora, id_manager){
  let all_colab = await get_colaboradores();

  let this_corretora_colabs = all_colab.filter(colab_obj =>{
    if(colab_obj.corretora+"" == "" || colab_obj.corretora == undefined){
      return false;
    }

    return ((colab_obj.corretora.toString() == id_corretora.toString()) && !(colab_obj._id.toString() == id_manager.toString()))
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

    return ((colab_obj.seguradora.toString() == id_seguradora.toString()) && !(colab_obj._id.toString() == id_manager.toString()))
  });

  let this_seg_manager = await get_colaboradores_by_id(id_manager);

  return {
    colaboradores: this_seguradora_colabs,
    manager: this_seg_manager
  };
}

module.exports = { get_colaboradores, get_colaboradores_corretora, get_colaboradores_seguradora };
