const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const db = require('../db');
const controller = require('./controller')

describe('Seguradoras Routes', () => {
  it('deveria retornar um json maneiro :)', async () => {
    const res = await request(app).get('/seguradoras')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"Message":"Funcionando"});
  })

  it('deveria retornar vazio', async () => {
    const res = await request(app).get('/seguradoras/all')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual([]);
  })

  it('deveria criar uma seguradora nova com um gerente', async () => {
    const res = await request(app).post('/seguradoras/new').send({
      seguradora: {
        name:"segurinha",
        cnpj:"2",
        telephone:"5",
        email:"contato@segurinha.com.br",
        address:"lugar desconhecido",
        seguradoras:[1,2,3]
      },
      manager: {
        name:"afonso colaborante",
        telephone:"999219075",
        email:"colaborador@legal.com",
        birthday: "today",
        job:"meter o loco"
      }
    })

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"Message":"Seguradora e gerente cadastrados com sucesso!"});
  })


  it('deveria pegar o nome da seguradora do banco de dados e modificar', async () => {

    const seguradoras_req = await controller.get_seguradoras();

    let seguradoras_num = seguradoras_req.length;

    segurinha = seguradoras_req[0];

    expect(segurinha.name).toEqual("segurinha");

    const res = await request(app).post(`/seguradoras/${segurinha._id}/edit`).send({
      name:"segurona"
    })

    expect(res.statusCode).toEqual(200);

    const seguradoras_req2 = await controller.get_seguradoras();

    expect(seguradoras_req2.length).toEqual(seguradoras_num);

    segurinha2 = seguradoras_req2[0];

    expect(segurinha2.name = "segurona");
  })

})
