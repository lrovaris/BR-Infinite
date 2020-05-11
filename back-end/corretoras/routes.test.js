const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const db = require('../db');
const controller = require('./controller')

describe('Corretoras Routes', () => {
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

    expect(res.body).toEqual({"message":"Corretora e gerente cadastrados com sucesso!"});
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

    expect(corretinha2.name = "corretona");
  })

})
