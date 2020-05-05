const MongoClient = require('mongodb').MongoClient;

// const url = process.env.MONGO_URL || "mongodb://luizfelipe:123456qwe@127.0.0.1:27017";
const url = process.env.MONGO_URL || "mongodb://luizfelipe:123456qwe@ds141410.mlab.com:41410/brinfinite";

const client = new MongoClient(url, { useNewUrlParser: true,  useUnifiedTopology: true   });
const cache = require('./memoryCache');
const logger = require('./logger')

let brinfinite;

async function init_db(){
  await client.connect();

  logger.log("Conectado");

  brinfinite = await client.db('brinfinite');

  return brinfinite;
}

async function get_db() {
  return brinfinite || await init_db()
}

module.exports = {
    init_db,
    get_db
};
