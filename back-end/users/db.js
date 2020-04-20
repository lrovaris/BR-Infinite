var cache = require('../memoryCache');

function get_users() {
    return new Promise((resolve, reject) => {
        global.db.collection("users").find({}).toArray((err, result) =>{
            if(err){
                reject(err);
            }
            else {
                console.log(result);
                cache.set("users", result);
                resolve(result);
            }
        });
    });
}

module.exports = { get_users };
