const ObjectId = require('mongodb').ObjectId;
var cache = require('../memoryCache');


function get_produtos() {
    return new Promise((resolve, reject) => {
        global.db.collection("produtos").find({}).toArray((err, result) =>{
            if(err){
                reject(err);
            }
            else {
                cache.set("produtos", result);
                resolve(result);
            }
        });
    });
}


function register_produto(new_produto) {
    return new Promise((resolve, reject) => {
        global.db.collection("produtos").insertOne(new_produto, (err, result) => {
            if(err){
                reject(err);
            }else {
                let new_produto_list = cache.get("produtos");
                new_produto_list.push(new_produto);
                cache.set("produtos",new_produto_list);
                console.log("Produto novo cadastrado");
                resolve(result);
            }
        });
    });
}

function update_produto(produto) {
   produto._id = new ObjectId(produto._id);

  return new Promise((resolve, reject) => {
    global.db.collection("produtos").replaceOne({_id: produto._id }, produto,{w: "majority", upsert: false} ,(err, result) =>{
      if(err){
          reject(err);
      }else{
        console.log(`Modificados ${result.result.nModified} elementos`);

        resolve(result);
      }
    });
  });
}

module.exports = { get_produtos, update_produto, register_produto };
