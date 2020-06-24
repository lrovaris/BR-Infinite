const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const controller = require('./controller')

let seg_test_id;

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
        birthday: "2020-05-01",
        job:"QA"
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
        birthday: "2020-05-01",
        job:"QA"
      }
    })

    expect(res.statusCode).toEqual(200)

    seg_test_id = res.body.seguradora._id

    expect(res.body.message).toEqual("Seguradora e gerente cadastrados com sucesso!");
  })


  it('deveria pegar o nome da seguradora do banco de dados e modificar', async () => {

    const seguradoras_req = await controller.get_seguradoras();

    let segurinha = seguradoras_req.find(seg => seg.name === "segurinha");

    let seg_id = segurinha._id

    const res = await request(app).post(`/seguradoras/${segurinha._id}/edit`).send({
      name:"segurona"
    })

    expect(res.statusCode).toEqual(200);

    const seguradoras_req2 = await controller.get_seguradoras();

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

  it('deveria gerar o csv de uma seguradora individual', async() => {
    const new_request = await request(app).get(`/seguradoras/${seg_test_id}/csv`)

    expect(new_request.status).toEqual(200);
  })

  it('deveria gerar o csv de todas as seguradoras', async() => {
    const new_request = await request(app).post(`/seguradoras/all/csv`).send({
      filters:[
        {
          type: "name",
          value: "seg"
        }
      ]
    })

    // console.log(JSON.stringify(new_request.body, null, 1));

    expect(new_request.status).toEqual(200);
  })

  it('filtros de seguradoras', async() => {
    const new_request = await request(app).post(`/seguradoras/filter`).send({
      filters:[
        {
          type: "name",
          value: "seg"
        }
      ]
    })

    // console.log(JSON.stringify(new_request.body, null, 1));

    expect(new_request.status).toEqual(200);
  })



})
