const logger = require('./logger')
const express = require('express');
const body_parser = require('body-parser');
const app = express();
const db = require('./db');
const router = require('./routes');
const cache = require('./memoryCache');
const cors = require('cors');

//Mudanças de ambiente
if(process.argv[2] === 'dev'){
  global.env = 'dev';
}

if(process.argv[2] === 'prod'){
  global.env = 'prod';
}


//Middleware

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
    }
    else {
      next();
    }
});

app.use(body_parser.urlencoded({ extended: true }));

app.use(body_parser.json());

app.use(router);

async function initialize_database() {
    logger.log("Inicializando banco de dados...");
    var _db = await(db.init_db());

    // Inicializando cache
    logger.log("Inicializando cache...");
    await require('./users/db').get_users();
    await require('./seguradoras/db').get_seguradoras();
    await require('./colaboradores/db').get_colaboradores();
    await require('./corretoras/db').get_corretoras();
    await require('./products/db').get_produtos();
    await require('./opportunities/db').get_opportunities();
    await require('./production/db').get_production_entries();
}

app.listen(3000, async () => {
    logger.log("Servidor Ligado, escutando na porta 3000");
    await initialize_database();
});

module.exports = app;
