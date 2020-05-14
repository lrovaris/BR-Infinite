const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
var cache = require('./memoryCache');

const auth = require('./users/utils.js').authenticate;

router.get('/', (req,res) => {
  res.status(200).json({"Message":"Funcionando"});
})

//Carregar rotas de usuário
router.use('/users', require('./users/routes'));

router.use(auth);

router.use('/seguradoras', require('./seguradoras/routes'));
router.use('/colaboradores', require('./colaboradores/routes'));
router.use('/corretoras', require('./corretoras/routes'));
router.use('/products', require('./products/routes'));
router.use('/opportunities', require('./opportunities/routes'));
router.use('/production', require('./production/routes'));

router.post('/flush', async(req,res) => {
  if (!req.body.youSure){
    return res.status(200).json({"Message":"ok"});
  }
  const db_conn = await db.get_db();

  await db_conn.collection("colaboradores").remove({})
  await db_conn.collection("corretoras").remove({})
  await db_conn.collection("opportunities").remove({})
  await db_conn.collection("production_entries").remove({})
  await db_conn.collection("produtos").remove({})
  await db_conn.collection("seguradoras").remove({})

  cache.flush()

  console.log("BOooOooOoOOM");
  res.status(200).json({"Message":"BOooOooOoOOM"});
})

module.exports = router;
