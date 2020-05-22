
const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const controller = require('./controller')

const my_csv_path = "1589898272624-48409787testecsv.csv";

let seguradora_id = '';

describe('Production Routes', () => {

  it('deveria criar uma seguradora, três corretoras, com os apelidos corretos e cadastrar entradas de produção', async () => {
    const seg = await request(app).post('/seguradoras/new').send({
      seguradora: { name:"segura_teste" },
      manager: { name:"Luis do QA", telephone:"999219075", email:"luis@segurateste.com", birthday: "01 - 05", job:"quebrar apps" }
    })

    seguradora_id = seg.body.seguradora._id;

    expect(seg.statusCode).toEqual(200)

    const corr_1 = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Correta"]},
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "today", job:"testar paradas" }
    })

    expect(corr_1.statusCode).toEqual(200)

    const corr_2 = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Nova"]},
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "today", job:"testar paradas" }
    })

    expect(corr_2.statusCode).toEqual(200)

    const corr_3 = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Corretora Legal"]},
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "today", job:"testar paradas" }
    })

    expect(corr_3.statusCode).toEqual(200)

    const entry_request = await request(app).post('/production/new').send({
      seguradora: seguradora_id,
      path: my_csv_path
    })

    expect(entry_request.statusCode).toEqual(200)

    let all_entries = await controller.get_entries();

    expect(all_entries.length).toEqual(9)
  })

})
