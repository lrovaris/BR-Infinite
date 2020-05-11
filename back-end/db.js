const MongoClient = require('mongodb').MongoClient;
// const url = process.env.MONGO_URL || "mongodb://luizfelipe:123456qwe@127.0.0.1:27017";
const url = process.env.MONGO_URL || "mongodb://luizfelipe:123456qwe@ds141410.mlab.com:41410/brinfinite";
const cache = require('./memoryCache');
const logger = require('./logger')

let client = new MongoClient(url, { useNewUrlParser: true,  useUnifiedTopology: true });
let connection;
let brinfinite;

async function init_db(){
  client = new MongoClient(url, { useNewUrlParser: true,  useUnifiedTopology: true });
  connection = await client.connect();
  brinfinite = await client.db('brinfinite');

  logger.log("Conectado");

  return brinfinite;
}

async function get_db() {
  return brinfinite || await init_db()
}

module.exports = {
    init_db,
    get_db
};
