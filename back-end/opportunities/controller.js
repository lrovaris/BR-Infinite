const db = require('./db');
const corretora_controller = require('../corretoras/controller')
const colaborador_controller = require('../colaboradores/controller')
const product_controller = require('../products/controller')
const seguradora_controller = require('../seguradoras/controller')
let cache = require('../memoryCache');


async function get_opportunities() {
  return cache.get('opportunities') || await db.get_opportunities();
}

async function get_opportunity_by_id(opp_id) {
  let all_opp = await get_opportunities();

  let opportunity = all_opp.find(opp_obj =>{
    return (opp_obj._id.toString() == opp_id.toString());
  });

  return opportunity;
}

async function validate_opportunity(opportunity) {
  if (opportunity === undefined){
    return{
      "valid": false,
      "message": "Oportunidade inválida"
    }
  }

  if (!opportunity.inclusionDate){
    return {
      "message":"Data inválida",
      "valid":false
    };
  }

  if (!opportunity.corretora){
    return {
      "message":"Corretora inválida",
      "valid":false
    };
  } else {
    if(await corretora_controller.get_corretora_by_id(opportunity.corretora) === undefined){
      return{
        "message":"Corretora inválida",
        "valid":false
      }
    }
  }

  if (!opportunity.colaborador){
    return {
      "message":"Colaborador inválido",
      "valid":false
    };
  } else {
    if(await colaborador_controller.get_colaboradores_by_id(opportunity.colaborador) === undefined){
      return{
        "message":"Colaborador inválido",
        "valid":false
      }
    }
  }

  if (!opportunity.proponente){
    return {
      "message":"Proponente inválida",
      "valid":false
    };
  }

  if (!opportunity.product){
    return {
      "message":"Produto inválido",
      "valid":false
    };
  } else {
    if(await product_controller.get_produto_by_id(opportunity.product) === undefined){
      return {
        "message":"Produto inválido",
        "valid":false
      };
    }
  }

  if (!opportunity.description){
    return {
      "message":"Descrição inválida",
      "valid":false
    };
  }

  if (!opportunity.dealType){
    return {
      "message":"Tipo de negócio inválido",
      "valid":false
    };
  }else {
    if(opportunity.dealType === "renovacao"){
      if (!opportunity.congenereRenewal){
        return {
          "message":"Congênere inválido",
          "valid":false
        };
      }

      if (!opportunity.vigencia){
        return {
          "message":"Vigência inválida",
          "valid":false
        };
      }
    }
  }

  if (!opportunity.congenereList){
    return {
      "message":"Congêneres inválidos",
      "valid":false
    };
  }else {
    if(opportunity.congenereList.length > 0){
      if(!opportunity.congenereList[0].name){
        opportunity.congenereList = opportunity.congenereList
        .map(obj => JSON.parse(obj))
      }
    }

    for (var i = 0; i < opportunity.congenereList.length; i++) {

      if (!opportunity.congenereList[i].name){
        return {
          "message":"Nome do congênere inválido",
          "valid":false
        };
      }

      if (!opportunity.congenereList[i].price){
        return {
          "message":"Preço do congênere inválido",
          "valid":false
        };
      }

      if (!opportunity.congenereList[i].comission){
        return {
          "message":"Comissão do congênere inválida",
          "valid":false
        };
      }
    }
  }

  if (!opportunity.seguradora){
    return {
      "message":"Seguradora inválida",
      "valid":false
    };
  } else {
    if(await seguradora_controller.get_seguradora_by_id(opportunity.seguradora) === undefined){
      return {
        "message":"Seguradora inválida",
        "valid":false
      };
    }
  }

  if (!opportunity.seguradoraPrice){
    return {
      "message":"Preço da seguradora inválido",
      "valid":false
    };
  }

  if (!opportunity.seguradoraComission){
    return {
      "message":"Comissão da seguradora inválida",
      "valid":false
    };
  }

  if (!opportunity.status){
    return {
      "message":"Status inválido",
      "valid":false
    };
  }

  return {"valid":true};
}


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
          return seg_obj.name.includes(filter_params[i].value)
        })

        const is_this_included = possible_seguradoras.find(seg_obj => {
          return seg_obj._id.toString() === opp_obj.seguradora.toString()
        })

        if(is_this_included === undefined){
          return false
        }
      }

      if(filter_params[i].type === "corretora"){

        const possible_corretoras = all_corretoras.filter(corr_obj => {
          return corr_obj.name.includes(filter_params[i].value)
        })

        const is_this_included = possible_corretoras.find(corr_obj => {
          return corr_obj._id.toString() === opp_obj.corretora.toString()
        })

        if(is_this_included === undefined){
          return false
        }
      }

      if(filter_params[i].type === "colaborador"){

        const possible_colaboradores = all_colaboradores.filter(col_obj => {
          return col_obj.name.includes(filter_params[i].value)
        })

        const is_this_included = possible_colaboradores.find(col_obj => {
          return col_obj._id.toString() === opp_obj.colaborador.toString()
        })

        if(is_this_included === undefined){
          return false
        }
      }

      if(filter_params[i].type === "product"){

        const possible_products = all_products.filter(prod_obj => {
          return prod_obj.name.includes(filter_params[i].value)
        })

        const is_this_included = possible_products.find(prod_obj => {
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



module.exports = { get_opportunities, get_opportunity_by_id, validate_opportunity, get_filtered_opportunities };
