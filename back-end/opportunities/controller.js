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

module.exports = { get_opportunities, get_opportunity_by_id, validate_opportunity };
