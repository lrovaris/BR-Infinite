const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const db = require('../db');
const controller = require('./controller')

let corr_id;

describe('Corretoras Routes', () => {

  it('deveria criar uma corretora nova com um gerente', async () => {
    const seg_request = await request(app).post('/seguradoras/new').send({
      seguradora: {
        name:"segurateste"
      },
      manager: {
        name:"afonso colaborante",
        telephone:"999219075",
        email:"colaborador@legal.com",
        birthday: "2020-05-01",
        job:"testar paradas"
      }
    })

    expect(seg_request.status).toEqual(200)

    const res = await request(app).post('/corretoras/new').send({
      corretora: {
        name:"corretinha",
        cnpj:"2",
        telephone:"5",
        email:"contato@corretinha.com.br",
        address:"lugar desconhecido",
        seguradoras:[ seg_request.body.seguradora._id ]
      },
      manager: {
        name:"afonso colaborante",
        telephone:"999219075",
        email:"colaborador@legal.com",
        birthday: "2020-05-01",
        job:"testar paradas"
      }
    })

    expect(res.statusCode).toEqual(200)

    corr_id = res.body.corretora._id;

    expect(res.body.message).toEqual("Corretora e gerente cadastrados com sucesso!");
  })

  it('deveria pegar o nome da corretora do banco de dados e modificar', async () => {

    const corretoras_req = await controller.get_corretoras();

    let corretinha = corretoras_req.find(corr => corr.name === "corretinha");

    let corr_id = corretinha._id;

    const res = await request(app).post(`/corretoras/${corretinha._id}/edit`).send({
      name:"corretona"
    })

    expect(res.statusCode).toEqual(200);

    const corretoras_req2 = await controller.get_corretoras();

    corretinha2 = corretoras_req2.find(corr => corr._id.toString() === corr_id.toString());

    expect(corretinha2.name).toEqual("corretona");
  })

  it('deveria tentar registrar duas corretoras e falhar na segunda pelo apelido estar em uso', async () => {
    await request(app).post('/corretoras/new').send({
      corretora: { name:"Corretora para testar o apelido", nicknames:["apelidada", "testadora"] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })

    let res = await request(app).post('/corretoras/new').send({
      corretora: { name:"Segunda corretora para testar o apelido", nicknames:["testadora"] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })

    expect(res.body.message).toEqual("Apelido em uso");
    expect(res.status).toEqual(400);
  })

  it('deveria tentar registrar duas corretoras, conseguir, tentar editar a segunda e falhar pelo apelido estar em uso', async () => {
    await request(app).post('/corretoras/new').send({
      corretora: { name:"Corretora para testar o apelido", nicknames:["corretora_testadora"] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })

    let res = await request(app).post('/corretoras/new').send({
      corretora: { name:"Segunda corretora para testar o apelido" },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })

    let corr_id = res.body.corretora._id;

    expect(res.status).toEqual(200);

    const edit = await request(app).post(`/corretoras/${corr_id}/edit`).send({
      nicknames:[
        "testante",
        "corretora_testadora"
      ]
    })

    expect(edit.body.message).toEqual("Apelido em uso");
    expect(edit.status).toEqual(400);
  })

  it('deveria gerar o csv de uma corretora individual', async() => {
    const new_request = await request(app).get(`/corretoras/${corr_id}/csv`)

    // console.log(JSON.stringify(new_request.body, null, 1));

    expect(new_request.status).toEqual(200);
  })

  it('deveria gerar o csv de todas as corretoras', async() => {
    const new_request = await request(app).post(`/corretoras/all/csv`).send({
      filters:[
        {
          type: "name",
          value: "apeli"
        }
      ]
    })

    // console.log(JSON.stringify(new_request.body, null, 1));

    expect(new_request.status).toEqual(200);
  })


  it('filtros de corretoras', async() => {
    const new_request = await request(app).post(`/corretoras/filter`).send({
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
