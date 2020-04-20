const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
var cache = require('./memoryCache');



router.get('/', (req,res) => {
  res.status(200).json({"Message":"Funcionando"});
})


//Carregar rotas de usuário
router.use('/user', require('./users/routes'))




module.exports = router;
