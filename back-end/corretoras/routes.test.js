const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const db = require('../db');
const controller = require('./controller')

describe('Corretoras Routes', () => {
  it('deveria retornar um json maneiro :)', async () => {
    const res = await request(app).get('/corretoras')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"Message":"Funcionando"});
  })

  it('deveria retornar vazio', async () => {
    const res = await request(app).get('/corretoras/all')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual([]);
  })

  it('deveria criar uma corretora nova com um gerente', async () => {
    const res = await request(app).post('/corretoras/new').send({
      corretora: {
        name:"corretinha",
        cnpj:"2",
        telephone:"5",
        email:"contato@corretinha.com.br",
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

    expect(res.body).toEqual({"Message":"Corretora e gerente cadastrados com sucesso!"});
  })


  it('deveria pegar o nome da corretora do banco de dados e modificar', async () => {

    const corretoras_req = await controller.get_corretoras();

    let corretoras_num = corretoras_req.length;

    corretinha = corretoras_req[0];

    expect(corretinha.name).toEqual("corretinha");

    const res = await request(app).post(`/corretoras/${corretinha._id}/edit`).send({
      name:"corretona"
    })

    expect(res.statusCode).toEqual(200);

    const corretoras_req2 = await controller.get_corretoras();

    expect(corretoras_req2.length).toEqual(corretoras_num);

    corretinha2 = corretoras_req2[0];

    expect(corretinha2.name = "corretona");
  })

})
