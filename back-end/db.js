const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL || "mongodb://luizfelipe:123456qwe@ds141410.mlab.com:41410/brinfinite"; // "mongodb://luizfelipe:123456qwe@127.0.0.1:27017" //
const client = new MongoClient(url, { useNewUrlParser: true  });
const cache = require('./memoryCache');
const logger = require('./logger')

let brinfinite;


async function init_db(){
    return new Promise((resolve, reject) => {
        client.connect( err => {
            if(err){
                reject(err);
            }
            else {
                logger.log("Conectado");
                brinfinite = client.db("brinfinite");
                resolve(brinfinite);
            }
        })
    }).catch(err => {console.log(err);})
}

async function get_db() {
  if(brinfinite !== undefined){
    return brinfinite;
  }else {
    return  await init_db();
  }
}

module.exports = {
    init_db,
    get_db
};
