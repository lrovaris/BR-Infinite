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

async function get_colaboradores_by_birthday(req_month){
  let all_colab = await get_colaboradores();

  let current_month;

  if(req_month === undefined){
    current_month = (new Date().getMonth() + 1);
  }
  else {
    current_month = req_month
  }

  let this_month_birthday_colabs = all_colab.filter(this_colab => {
    return getDateInfoFromString(this_colab.birthday).month === current_month
  })

  this_month_birthday_colabs = this_month_birthday_colabs.map(colab => {
    return{
      name: colab.name,
      birthday: colab.birthday,
      seguradora: colab.seguradora,
      corretora: colab.corretora
    }
  })


  return this_month_birthday_colabs
}

function getDateInfoFromString(date) {
  if(date === undefined){
    return {
      valid: false
    }
  }
  let isValidDate = true;

  let this_year

  if(date.split("-")[0]){
      this_year = Number(date.split("-")[0].toString())
  }


  if(this_year === null  || isNaN(this_year)){
    isValidDate = false
  }

  let this_month
  if(date.split("-")[1]){
      this_month = Number(date.split("-")[1].toString())
  }

  if(this_month === null  || isNaN(this_month)){
    isValidDate = false
  }

  let this_day
  if(date.split("-")[2]){
      this_day = Number(date.split("-")[2].toString())
  }

  if(this_day === null || isNaN(this_day)){
    isValidDate = false
  }

  let this_response = {
    year: this_year,
    month: this_month,
    day: this_day,
    valid: isValidDate
  }

  return this_response;
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

  return{ valid: true }
}

async function register_colaborador(new_colab){
  let db_colab = await db.register_colaborador(new_colab).catch(err => console.error(err));

  return db_colab;
}

module.exports = {
  get_colaboradores,
  get_colaboradores_by_id,
  get_colaboradores_corretora,
  get_colaboradores_seguradora,
  validate_colaborador,
  register_colaborador,
  get_colaboradores_by_birthday
};
