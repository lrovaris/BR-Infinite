const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const logger = require('../logger');

const db_utils = require('../db.js');

// Função para pegar todos os colaboradores do banco de dados
async function get_colaboradores() {
  // Pegando a conexão com o banco de dados
  let db_conn = await db_utils.get_db();

  // Pedindo todos os colaboradores para o banco de dados
  const colabs = await db_conn.collection("colaboradores").find({}).toArray();

  // Listando o cache como todos os colaboradores
  cache.set("colaboradores", colabs);

  // Retornando o valor pego do banco de dados
  return colabs;
}

// Função para registrar um colaborador novo
async function register_colaborador(new_colaborador) {
  // Pegando a conexão com o banco de dados
  let db_conn = await db_utils.get_db();

  // Fazendo a operação de inserir o novo colaborador, passando o parâmetro recebido na invocação da função
  const new_colab = await db_conn.collection("colaboradores").insertOne(new_colaborador);

  // Resetando o cache
  await get_colaboradores();

  // Logando o cadastro
  logger.log("Colaborador novo cadastrado");

  // Retornando o novo colaborador
  return new_colab.ops[0];
}

async function update_colaborador(colaborador) {
   let db_conn = await db_utils.get_db();

   let edited_colab = await db_conn.collection("colaboradores").replaceOne({_id: new ObjectId(colaborador._id) }, colaborador,{w: "majority", upsert: false});

   logger.log(`Modificados ${edited_colab.result.nModified} elementos`);

   await get_colaboradores();

   return edited_colab.ops[0];
}

module.exports = { get_colaboradores, update_colaborador, register_colaborador };
