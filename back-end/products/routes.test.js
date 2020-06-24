const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const controller = require('./controller')

let seguradora_id;

describe('Produtos Routes', () => {

  it('deveria retornar um json maneiro :)', async () => {
    const res = await request(app).get('/products')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"message":"Funcionando"});
  })

  it('deveria criar um produto novo (assim como uma seguradora)', async () => {
    const seg_req = await request(app).post('/seguradoras/new').send({
      seguradora: { name:"seguradora_de_teste_de_produtos" },
      manager: { name:"Luis do QA", telephone:"999219075", email:"luis@segurateste.com", birthday: "1996-05-01", job:"quebrar apps" }
    })

    expect(seg_req.statusCode).toEqual(200)

    seguradora_id = seg_req.body.seguradora._id;

    const res = await request(app).post('/products/new').send({
      name:"Seguro de vida",
      description:"huh",
      seguradoras: [ seguradora_id ]
    })

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"message":"Produto cadastrado com sucesso!"});
  })

  it('filtros de produtos', async() => {
    const new_request = await request(app).post(`/products/filter`).send({
      filters:[
        {
          type: "seguradoras",
          value: "s"
        }
      ]
    })

    // console.log(JSON.stringify(new_request.body, null, 1));

    expect(new_request.status).toEqual(200);
  })

})
