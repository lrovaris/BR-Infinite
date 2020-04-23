const logger = require('./logger')

module.exports = function () {
    var cache = {};
    return {
        get: function (key) {
          return cache[key];
        },
        set: function (key, val) {
          logger.log("Objeto " + key + " salvo na memória");
          cache[key] = val;
        }
    }
}();
