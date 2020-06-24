
const corretora_controller = require('../../corretoras/controller')
const colaborador_controller = require('../../colaboradores/controller')
const product_controller = require('../../products/controller')
const seguradora_controller = require('../../seguradoras/controller')

const { get_opportunities } = require('./defaultController')

async function get_filtered_opportunities(filter_params) {

  for (var i = 0; i < filter_params.length; i++) {
    if(
      filter_params[i].type !== "seguradora"
      && filter_params[i].type !== "corretora"
      && filter_params[i].type !== "colaborador"
      && filter_params[i].type !== "inclusionDateBefore"
      && filter_params[i].type !== "inclusionDateAfter"
      && filter_params[i].type !== "product"
      && filter_params[i].type !== "description"
      && filter_params[i].type !== "dealType"
      && filter_params[i].type !== "vigenciaBefore"
      && filter_params[i].type !== "vigenciaAfter"
      && filter_params[i].type !== "status"
    ){
      return{
        valid: false,
        message: `Tipo ${filter_params[i].type} não identificado`
      }
    }
  }

  const all_opportunities = await get_opportunities()
  const all_seguradoras = await seguradora_controller.get_seguradoras();
  const all_corretoras = await corretora_controller.get_corretoras();
  const all_colaboradores = await colaborador_controller.get_colaboradores();
  const all_products = await product_controller.get_produtos()


  let filtered_opportunities = all_opportunities.filter(opp_obj => {

    for (var i = 0; i < filter_params.length; i++) {
      if (filter_params[i].value === "" || filter_params[i].value === " "){
        continue;
      }

      if(filter_params[i].type === "seguradora"){

        const possible_seguradoras = all_seguradoras.filter(seg_obj => {
          return seg_obj.name.toLowerCase().includes(filter_params[i].value.toLowerCase())
        })

        const is_this_included = possible_seguradoras.find(seg_obj => {

          if(opp_obj.seguradora._id !== undefined){
              return seg_obj._id.toString() === opp_obj.seguradora._id.toString()
          }

          return seg_obj._id.toString() === opp_obj.seguradora.toString()
        })

        if(is_this_included === undefined){
          return false
        }
      }

      if(filter_params[i].type === "corretora"){

        const possible_corretoras = all_corretoras.filter(corr_obj => {
          return corr_obj.name.toLowerCase().includes(filter_params[i].value.toLowerCase())
        })

        const is_this_included = possible_corretoras.find(corr_obj => {

          if(opp_obj.corretora._id !== undefined){
              return corr_obj._id.toString() === opp_obj.corretora._id.toString()
          }

          return corr_obj._id.toString() === opp_obj.corretora.toString()
        })

        if(is_this_included === undefined){
          return false
        }
      }

      if(filter_params[i].type === "colaborador"){

        const possible_colaboradores = all_colaboradores.filter(col_obj => {
          return col_obj.name.toLowerCase().includes(filter_params[i].value.toLowerCase())
        })

        const is_this_included = possible_colaboradores.find(col_obj => {

          if(opp_obj.colaborador._id !== undefined){
              return col_obj._id.toString() === opp_obj.colaborador._id.toString()
          }

          return col_obj._id.toString() === opp_obj.colaborador.toString()
        })

        if(is_this_included === undefined){
          return false
        }
      }

      if(filter_params[i].type === "product"){

        const possible_products = all_products.filter(prod_obj => {
          return prod_obj.name.toLowerCase().includes(filter_params[i].value.toLowerCase())
        })

        const is_this_included = possible_products.find(prod_obj => {

          if(opp_obj.product._id !== undefined){
              return prod_obj._id.toString() === opp_obj.product._id.toString()
          }

          return prod_obj._id.toString() === opp_obj.product.toString()
        })

        if(is_this_included === undefined){
          return false
        }
      }

      if (filter_params[i].type === "description"){

        if(!opp_obj.description.toLowerCase().includes(filter_params[i].value.toLowerCase())){
          return false
        }
      }

      if (filter_params[i].type === "dealType"){

        if(!opp_obj.dealType.toLowerCase().includes(filter_params[i].value.toLowerCase())){
          return false
        }
      }

      if (filter_params[i].type === "status"){

        if(!opp_obj.status.toLowerCase().includes(filter_params[i].value.toLowerCase())){
          return false
        }
      }

      //Quero saber se essa data é anterior à data de inclusão do filtro
      //ou seja, se ela for maior, não retornar
      if (filter_params[i].type === "inclusionDateBefore"){

        if(isTheNewDateBigger(filter_params[i].value, opp_obj.inclusionDate)){
          return false
        }

      }

      if (filter_params[i].type === "inclusionDateAfter"){

        if(isTheNewDateBigger(opp_obj.inclusionDate, filter_params[i].value)){
          return false
        }

      }

      if (filter_params[i].type === "vigenciaBefore"){

        if(isTheNewDateBigger(filter_params[i].value, opp_obj.vigencia)){
          return false
        }

      }

      if (filter_params[i].type === "vigenciaAfter"){

        if(isTheNewDateBigger(opp_obj.vigencia, filter_params[i].value)){
          return false
        }

      }

    }

    return true
  })

  return{
    valid: true,
    data: filtered_opportunities
  }
}

function getDateInfoFromString(date) {
  if(date === undefined){
    return {
      valid: false
    }
  }
  let isValidDate = true;

  let separator;

  if(date.includes('-')){
    separator = "-"
  }else {
    separator = "/"
  }

  let this_year

  if(date.split(separator)[0]){
      this_year = Number(date.split(separator)[0].toString())
  }


  if(this_year === null  || isNaN(this_year)){
    isValidDate = false
  }

  let this_month
  if(date.split(separator)[1]){
      this_month = Number(date.split(separator)[1].toString())
  }

  if(this_month === null  || isNaN(this_month)){
    isValidDate = false
  }

  let this_day
  if(date.split(separator)[2]){
      this_day = Number(date.split(separator)[2].toString())
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

function isTheNewDateBigger(oldDate, newDate) {

  let dataNew = getDateInfoFromString(newDate);

  let dataOld = getDateInfoFromString(oldDate);

  if (dataNew.year < dataOld.year) {
    return false
  } else if ( (dataNew.year >= dataOld.year) ) {
    if (dataNew.month < dataOld.month) {
      return false
    } else if ( dataNew.month >= dataOld.month) {
      if (dataNew.day < dataOld.day) {
        return false
      } else if ( dataNew.day > dataOld.day ) {
        return true
      }
      if (dataNew.month > dataOld.month) {
        return true
      }
    }
    return dataNew.year > dataOld.year;
  }
}

module.exports = { get_filtered_opportunities };
