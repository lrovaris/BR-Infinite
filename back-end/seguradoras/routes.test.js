const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const db = require('../db');
const controller = require('./controller')

describe('Seguradoras Routes', () => {

  it('deveria falhar em criar uma seguradora nova', async () => {
    const res = await request(app).post('/seguradoras/new').send({
      seguradora: {
        cnpj:"2",
        telephone:"5",
        email:"contato@segurinha.com.br",
        address:"lugar desconhecido"
      }
    })

    expect(res.statusCode).toEqual(400)

    expect(res.body).toEqual({"message":"Campo de nome da seguradora vazio"});

  })

  it('deveria falhar em criar uma seguradora nova', async () => {
    const res = await request(app).post('/seguradoras/new').send({
      seguradora: {
        name:"segurinha",
        cnpj:"2",
        telephone:"5",
        email:"contato@segurinha.com.br",
        address:"lugar desconhecido"
      },
      manager: {
        name:"afonso colaborante",
        telephone:"999219075",
        birthday: "today",
        job:"meter o loco"
      }
    })

    expect(res.statusCode).toEqual(400)

    expect(res.body).toEqual({"message":"Campo de email do colaborador vazio"});
  })

  it('deveria criar uma seguradora nova com um gerente', async () => {
    const res = await request(app).post('/seguradoras/new').send({
      seguradora: {
        name:"segurinha",
        cnpj:"2",
        telephone:"5",
        email:"contato@segurinha.com.br",
        address:"lugar desconhecido"
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

    expect(res.body).toEqual({"message":"Seguradora e gerente cadastrados com sucesso!"});
  })


  it('deveria pegar o nome da seguradora do banco de dados e modificar', async () => {

    const seguradoras_req = await controller.get_seguradoras();

    let seguradoras_num = seguradoras_req.length;

    let segurinha = seguradoras_req.find(seg => seg.name === "segurinha");

    let seg_id = segurinha._id

    const res = await request(app).post(`/seguradoras/${segurinha._id}/edit`).send({
      name:"segurona"
    })

    expect(res.statusCode).toEqual(200);

    const seguradoras_req2 = await controller.get_seguradoras();

    expect(seguradoras_req2.length).toEqual(seguradoras_num);

    let segurinha2 = seguradoras_req2.find(seg => seg._id.toString() === seg_id.toString());

    expect(segurinha2.name = "segurona");

  })


  it('deveria pegar os dados de uma única seguradora junto com seus colaboradores', async () => {

    const seguradoras_req = await controller.get_seguradoras();

    let seguradoras_num = seguradoras_req.length;

    segurinha = seguradoras_req.find(seg => seg.name === "segurona");

    const res = await request(app).get(`/seguradoras/${segurinha._id}`)

    expect(res.statusCode).toEqual(200);

    expect(res.body.manager.name).toEqual("afonso colaborante");

  })

})
