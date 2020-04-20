const express = require('express');
const body_parser = require('body-parser');
const app = express();
const db = require('./db');
const router = require('./routes');
const cache = require('./memoryCache');
const cors = require('cors');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();
});

// const allowedOrigins = [
//     'capacitor://localhost',
//     'ionic://localhost',
//     'http://localhost',
//     'http://localhost:8080',
//     'http://localhost:4200'
// ];
// const corsOptions = {
//     origin: (origin, callback) => {
//         if (allowedOrigins.includes(origin) || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Origin not allowed by CORS'));
//         }
//     }
// };
//
// app.options('*', cors(corsOptions));
//
// var all_users = [];

app.use(body_parser.urlencoded({ extended: true }));

app.use(body_parser.json());

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
//     next();
// });

app.use(router);

async function initialize_database() {
    console.log("Inicializando banco de dados...");
    var _db = await(db.init_db());
    await db.get_users();
}

app.listen(3000, () => {
    console.log("Servidor Ligado, escutando na porta 3000");
    initialize_database();
});
