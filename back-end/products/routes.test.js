const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const db = require('../db');
const controller = require('./controller')

describe('Produtos Routes', () => {
  it('deveria retornar um json maneiro :)', async () => {
    const res = await request(app).get('/products')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"message":"Funcionando"});
  })

  it('deveria criar um produto novo', async () => {
    const res = await request(app).post('/products/new').send({
      name:"produto legal",
      description:"almas de pecadores",
      seguradoras: [1,23]
    })

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"message":"Produto cadastrado com sucesso!"});
  })


  it('deveria pegar o nome da produto do banco de dados e modificar', async () => {

    const produtos_req = await controller.get_produtos();

    let produtos_num = produtos_req.length;

    produto_novo = produtos_req[0];

    expect(produto_novo.name).toEqual("produto legal");

    const res = await request(app).post(`/products/${produto_novo._id}/edit`).send({
      name:"produtop"
    })

    expect(res.statusCode).toEqual(200);

    const produtos_req2 = await controller.get_produtos();

    expect(produtos_req2.length).toEqual(produtos_num);

    produto_novo2 = produtos_req2[0];

    expect(produto_novo2.name = "produtop");
  })

})
