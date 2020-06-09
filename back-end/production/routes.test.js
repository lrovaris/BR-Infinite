
const request = require('supertest')
const app = require('../server')
const controller = require('./controller')

const my_csv_path = "1589898272624-48409787testecsv.csv";
const other_csv_path = "csv-exemplo.csv";
const monthly_test_csv = "testerelatoriomensal.csv"
const corr_test_csv = "corretora_ex.csv"

let seguradora_id = '';
let seg;
let corr_1;
let corr_2;
let corr_3;

let month_year_seg_id = "";

let corretora_id = "";

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
    expect(new_request.body.dates['2020'] !== undefined).toEqual(true)
    expect(new_request.body.dates['2020']['5'].length).toEqual(3)

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

    expect(new_request.statusCode).toEqual(200)
    expect(new_request.body.dates['2020'] !== undefined).toEqual(true)
    expect(new_request.body.dates['2021'] !== undefined).toEqual(true)
    expect(new_request.body.dates['2020']['5'].length).toEqual(8)
  })

  it('deveria retornar um relatório com array para cada corretora de uma seguradora com todas produções de um mês quebrado por cada dia', async () => {
    let new_request = await request(app).post(`/production/seguradoras/${seguradora_id}/report/daily`).send({
      month: 5,
      year: 2020
    })

    expect(new_request.statusCode).toEqual(200)
    expect(new_request.body.report.total).toEqual(20470)
    expect(new_request.body.report.report.length).toEqual(4)
  })

  it('deveria criar uma seguradora, adicionar um relatório com dois meses, e fazer uma requisição que retorna um relatório com array para cada corretora de uma seguradora com a última produção de cada mês de um intervalo de meses', async () => {
    let new_seg = await request(app).post('/seguradoras/new').send({
      seguradora: { name:"segura_teste" },
      manager: { name:"Luis do QA", telephone:"999219075", email:"luis@segurateste.com", birthday: "01 - 05", job:"quebrar apps" }
    })

    month_year_seg_id = new_seg.body.seguradora._id;

    expect(new_seg.statusCode).toEqual(200)

    let new_corr = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["novo teste"], seguradoras:[ month_year_seg_id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "today", job:"testar paradas" }
    })

    expect(new_corr.statusCode).toEqual(200)

    const entry_request = await request(app).post('/production/new').send({
      seguradora: month_year_seg_id,
      path: monthly_test_csv
    })

    expect(entry_request.statusCode).toEqual(200)

    let new_request = await request(app).post(`/production/seguradoras/${month_year_seg_id}/report/monthly`).send({
      beginYear: 2020,
      beginMonth: 5,
      endYear: 2021,
      endMonth: 6
    })

    expect(new_request.statusCode).toEqual(200)
    expect(new_request.body.report.total).toEqual(3983)
    expect(new_request.body.report.report.length).toEqual(1)
    expect(new_request.body.report.report[0].corr_report.length).toEqual(4)
  })

  it('deveria fazer uma requisição que retorna um relatório com array para cada corretora de uma seguradora com a produção anual de um intervalo', async () => {
    let new_request = await request(app).post(`/production/seguradoras/${month_year_seg_id}/report/yearly`).send({
      beginYear: 2020,
      endYear: 2021,
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('deveria fazer uma requisição que retorna um array para cada corretora de uma seguradora com uma comparação entre dois dias escolhidos', async () => {
    let new_request = await request(app).post(`/production/seguradoras/${month_year_seg_id}/compare/daily`).send({
      firstYear: 2020,
      firstMonth: 5,
      firstDay: 19,
      secondYear: 2021,
      secondMonth: 5,
      secondDay: 19
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('deveria fazer uma requisição que retorna um array para cada corretora de uma seguradora com uma comparação entre dois meses escolhidos', async () => {
    let new_request = await request(app).post(`/production/seguradoras/${month_year_seg_id}/compare/monthly`).send({
      firstYear: 2020,
      firstMonth: 5,
      secondYear: 2021,
      secondMonth: 5,
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('deveria fazer uma requisição que retorna um array para cada corretora de uma seguradora com uma comparação entre dois anos escolhidos', async () => {
    let new_request = await request(app).post(`/production/seguradoras/${month_year_seg_id}/compare/yearly`).send({
      firstYear: 2020,
      secondYear: 2021
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('deveria criar uma corretora, uma seguradora, e cadastrar entradas de produção', async () => {

    let new_seg = await request(app).post('/seguradoras/new').send({
      seguradora: { name:"segura_teste" },
      manager: { name:"Luis do QA", telephone:"999219075", email:"luis@segurateste.com", birthday: "01 - 05", job:"quebrar apps" }
    })

    expect(new_seg.statusCode).toEqual(200)

    let new_corr = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["LaCorreta"], seguradoras:[ new_seg.body.seguradora._id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "today", job:"testar paradas" }
    })

    corretora_id = new_corr.body.corretora._id;

    expect(new_corr.statusCode).toEqual(200)

    const entry_request = await request(app).post('/production/new').send({
      seguradora: new_seg.body.seguradora._id,
      path: corr_test_csv
    })

    expect(entry_request.statusCode).toEqual(200)
  })

  it('deveria retornar um objeto com as datas disponíveis para uma corretora', async () => {
    const dates_request = await request(app).get(`/production/corretoras/${corretora_id}`)

    // console.log(JSON.stringify(dates_request.body, null, 1));

    expect(dates_request.statusCode).toEqual(200)
  })

  it('deveria retornar um relatório com array para cada seguradora de uma corretora com todas produções de um mês quebrado por cada dia', async () => {
    let new_request = await request(app).post(`/production/corretoras/${corretora_id}/report/daily`).send({
      month: 5,
      year: 2020
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('deveria retornar um relatório com array para cada seguradora de uma corretora com todas produções de um intervalo de tempo quebrado por cada mês', async () => {
    let new_request = await request(app).post(`/production/corretoras/${corretora_id}/report/monthly`).send({
      beginYear: 2020,
      beginMonth: 5,
      endYear: 2021,
      endMonth: 6
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('deveria fazer uma requisição que retorna um relatório com array para cada corretora de uma seguradora com a produção anual de um intervalo', async () => {
    let new_request = await request(app).post(`/production/corretoras/${corretora_id}/report/yearly`).send({
      beginYear: 2020,
      endYear: 2021,
    })

    expect(new_request.statusCode).toEqual(200)
  })



})
