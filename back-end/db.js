const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL || "mongodb://luizfelipe:123456qwe@ds141410.mlab.com:41410/brinfinite";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true  });
const cache = require('./memoryCache');
const logger = require('./logger')

function init_db(){
    return new Promise((resolve, reject) => {
        client.connect(err => {
            if(err){
                reject(err);
            }
            else {
                logger.log("Conectado");
                global.db = client.db("brinfinite");
                resolve(global.db);
            }
        });
    });
}

module.exports = {
    init_db
};
