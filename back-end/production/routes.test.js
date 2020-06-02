
const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const controller = require('./controller')

const my_csv_path = "1589898272624-48409787testecsv.csv";
const other_csv_path = "csv-exemplo.csv";


let seguradora_id = '';
let seg;
let corr_1;
let corr_2;
let corr_3;

describe('Production Routes', () => {

  it('deveria criar uma seguradora, três corretoras, com os apelidos corretos e cadastrar entradas de produção', async () => {
    seg = await request(app).post('/seguradoras/new').send({
      seguradora: { name:"segura_teste" },
      manager: { name:"Luis do QA", telephone:"999219075", email:"luis@segurateste.com", birthday: "01 - 05", job:"quebrar apps" }
    })

    seguradora_id = seg.body.seguradora._id;

    expect(seg.statusCode).toEqual(200)

    corr_1 = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Correta"], seguradoras:[ seguradora_id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "today", job:"testar paradas" }
    })

    expect(corr_1.statusCode).toEqual(200)

    corr_2 = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Nova"], seguradoras:[ seguradora_id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "today", job:"testar paradas" }
    })

    expect(corr_2.statusCode).toEqual(200)

    corr_3 = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Corretora Legal"], seguradoras:[ seguradora_id ] },
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

  it('deveria retornar um array com a produção de todas as corretoras de uma seguradora', async () => {
    let nova_corr = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretora sem producao",  nicknames:["hum"], seguradoras:[ seguradora_id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "today", job:"testar paradas" }
    })

    expect(nova_corr.statusCode).toEqual(200)

    let new_request = await request(app).get(`/production/seguradoras/${seguradora_id}`)

    // console.log(JSON.stringify(new_request.body, null, 1));

    expect(new_request.statusCode).toEqual(200)
    expect(new_request.body.report.length).toEqual(4)
  })


  it('deveria criar uma seguradora, uma corretora e cadastrar uma nova produção, com mais de um ano e vários meses', async () => {
    let new_seg = await request(app).post('/seguradoras/new').send({
      seguradora: { name:"segura_teste" },
      manager: { name:"Luis do QA", telephone:"999219075", email:"luis@segurateste.com", birthday: "01 - 05", job:"quebrar apps" }
    })

    let new_seguradora_id = new_seg.body.seguradora._id;

    expect(new_seg.statusCode).toEqual(200)

    let new_corr = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Corretora"], seguradoras:[ new_seguradora_id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "today", job:"testar paradas" }
    })

    expect(new_corr.statusCode).toEqual(200)

    const entry_request = await request(app).post('/production/new').send({
      seguradora: new_seguradora_id,
      path: other_csv_path
    })

    expect(entry_request.statusCode).toEqual(200)

    let new_request = await request(app).get(`/production/seguradoras/${new_seguradora_id}`)

    // console.log(JSON.stringify(new_request.body, null, 1));
  })


  it('deveria retornar um array para cada corretora de uma seguradora com todas produções de um intervalo de tempo', async () => {
    let new_request = await request(app).get(`/production/seguradoras/${seguradora_id}`)

    // console.log(JSON.stringify(new_request.body, null, 1));

    expect(new_request.statusCode).toEqual(200)
    expect(new_request.body.report.length).toEqual(4)
  })

})
