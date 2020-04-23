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

module.exports = router;
