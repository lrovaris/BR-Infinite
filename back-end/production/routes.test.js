
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
      manager: { name:"Luis do QA", telephone:"999219075", email:"luis@segurateste.com", birthday: "2020-05-01", job:"quebrar apps" }
    })

    seguradora_id = seg.body.seguradora._id;

    expect(seg.statusCode).toEqual(200)

    corr_1 = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Correta"], seguradoras:[ seguradora_id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })

    expect(corr_1.statusCode).toEqual(200)

    corr_2 = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Nova"], seguradoras:[ seguradora_id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })

    expect(corr_2.statusCode).toEqual(200)

    corr_3 = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Corretora Legal"], seguradoras:[ seguradora_id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })

    expect(corr_3.statusCode).toEqual(200)

    const entry_request = await request(app).post('/production/new').send({
      seguradora: seguradora_id,
      path: my_csv_path,
      date: "15/05/2020"
    })

    await request(app).post('/production/new').send({
      seguradora: seguradora_id,
      path: my_csv_path,
      date: "16/05/2020"
    })

    expect(entry_request.statusCode).toEqual(200)
  })

  it('deveria retornar um array com a produção de todas as corretoras de uma seguradora', async () => {
    let nova_corr = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretora sem producao",  nicknames:["hum"], seguradoras:[ seguradora_id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })

    expect(nova_corr.statusCode).toEqual(200)

    let new_request = await request(app).get(`/production/seguradoras/${seguradora_id}`)

    // console.log(JSON.stringify(new_request.body, null, 1));

    expect(new_request.statusCode).toEqual(200)
    expect(new_request.body.dates['2020'] !== undefined).toEqual(true)
  })

  it('deveria criar uma seguradora, uma corretora e cadastrar uma nova produção, com mais de um ano e vários meses', async () => {
    let new_seg = await request(app).post('/seguradoras/new').send({
      seguradora: { name:"segura_teste" },
      manager: { name:"Luis do QA", telephone:"999219075", email:"luis@segurateste.com", birthday: "2020-05-01", job:"quebrar apps" }
    })

    let new_seguradora_id = new_seg.body.seguradora._id;

    expect(new_seg.statusCode).toEqual(200)

    let new_corr = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Corretora"], seguradoras:[ new_seguradora_id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })

    expect(new_corr.statusCode).toEqual(200)

    const entry_request = await request(app).post('/production/new').send({
      seguradora: new_seguradora_id,
      path: other_csv_path,
      date: "21/05/2020"
    })

    expect(entry_request.statusCode).toEqual(200)

    let new_request = await request(app).get(`/production/seguradoras/${new_seguradora_id}`)

    expect(new_request.statusCode).toEqual(200)
    expect(new_request.body.dates['2020'] !== undefined).toEqual(true)
  })

  it('relatório diário da seguradora', async () => {
    let new_request = await request(app).post(`/production/seguradoras/${seguradora_id}/report/daily`).send({
      month: 5,
      year: 2020
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('(CSV) relatório diário da seguradora', async () => {
    let new_request = await request(app).post(`/production/seguradoras/${seguradora_id}/report/daily/csv`).send({
      month: 5,
      year: 2020
    })

    // console.log(JSON.stringify(new_request.body));

    expect(new_request.statusCode).toEqual(200)
  })


  it('relatório mensal da seguradora', async () => {
    let new_seg = await request(app).post('/seguradoras/new').send({
      seguradora: { name:"segura_teste" },
      manager: { name:"Luis do QA", telephone:"999219075", email:"luis@segurateste.com", birthday: "2020-05-01", job:"quebrar apps" }
    })

    month_year_seg_id = new_seg.body.seguradora._id;

    expect(new_seg.statusCode).toEqual(200)

    let new_corr = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["novo teste"], seguradoras:[ month_year_seg_id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })

    expect(new_corr.statusCode).toEqual(200)

    const entry_request = await request(app).post('/production/new').send({
      seguradora: month_year_seg_id,
      path: monthly_test_csv,
      date: "21/05/2020"
    })

    expect(entry_request.statusCode).toEqual(200)

    let new_request = await request(app).post(`/production/seguradoras/${month_year_seg_id}/report/monthly`).send({
      beginYear: 2020,
      beginMonth: 5,
      endYear: 2021,
      endMonth: 6
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('relatório anual da seguradora', async () => {
    let new_request = await request(app).post(`/production/seguradoras/${month_year_seg_id}/report/yearly`).send({
      beginYear: 2020,
      endYear: 2021,
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('comparação diária de uma seguradora', async () => {
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

  it('comparação mensal de uma seguradora', async () => {
    let new_request = await request(app).post(`/production/seguradoras/${month_year_seg_id}/compare/monthly`).send({
      firstYear: 2020,
      firstMonth: 5,
      secondYear: 2021,
      secondMonth: 5,
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('comparação anual de uma seguradora', async () => {
    let new_request = await request(app).post(`/production/seguradoras/${month_year_seg_id}/compare/yearly`).send({
      firstYear: 2020,
      secondYear: 2021
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('deveria criar uma corretora, uma seguradora, e cadastrar entradas de produção', async () => {

    let new_seg = await request(app).post('/seguradoras/new').send({
      seguradora: { name:"segura_teste" },
      manager: { name:"Luis do QA", telephone:"999219075", email:"luis@segurateste.com", birthday: "2020-05-01", job:"quebrar apps" }
    })

    expect(new_seg.statusCode).toEqual(200)

    let new_corr = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["LaCorreta"], seguradoras:[ new_seg.body.seguradora._id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })

    corretora_id = new_corr.body.corretora._id;

    expect(new_corr.statusCode).toEqual(200)

    const entry_request = await request(app).post('/production/new').send({
      seguradora: new_seg.body.seguradora._id,
      path: corr_test_csv,
      date: "21/06/2020"
    })

    expect(entry_request.statusCode).toEqual(200)
  })

  it('objeto de datas de uma corretora', async () => {
    const dates_request = await request(app).get(`/production/corretoras/${corretora_id}`)

    expect(dates_request.statusCode).toEqual(200)
  })

  it('relatório diário de uma corretora', async () => {
    let new_request = await request(app).post(`/production/corretoras/${corretora_id}/report/daily`).send({
      month: 6,
      year: 2020
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('relatório mensal de uma corretora', async () => {
    let new_request = await request(app).post(`/production/corretoras/${corretora_id}/report/monthly`).send({
      beginYear: 2020,
      beginMonth: 5,
      endYear: 2021,
      endMonth: 6
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('relatório anual de uma corretora', async () => {
    let new_request = await request(app).post(`/production/corretoras/${corretora_id}/report/yearly`).send({
      beginYear: 2020,
      endYear: 2021,
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('comparação diária de uma corretora', async () => {
    let new_request = await request(app).post(`/production/corretoras/${corretora_id}/compare/daily`).send({
      firstYear: 2020,
      firstMonth: 5,
      firstDay: 19,
      secondYear: 2021,
      secondMonth: 5,
      secondDay: 19
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('comparação mensal de uma corretora', async () => {
    let new_request = await request(app).post(`/production/corretoras/${corretora_id}/compare/monthly`).send({
      firstYear: 2020,
      firstMonth: 5,
      secondYear: 2021,
      secondMonth: 5,
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('comparação anual de uma corretora', async () => {
    let new_request = await request(app).post(`/production/corretoras/${corretora_id}/compare/yearly`).send({
      firstYear: 2020,
      secondYear: 2021
    })

    expect(new_request.statusCode).toEqual(200)
  })

  it('relatório do mês atual de todas as seguradoras', async () => {
    let new_request = await request(app).get(`/production/seguradoras/home_report`)

    // console.log(JSON.stringify(new_request.body, null, 1));

    expect(new_request.statusCode).toEqual(200)
  })

  it('cadastrar novas entradas e sobrescrever essas entradas', async() =>{

    let new_seg = await request(app).post('/seguradoras/new').send({
      seguradora: { name:"segura_teste" },
      manager: { name:"Luis do QA", telephone:"999219075", email:"luis@segurateste.com", birthday: "2020-05-01", job:"quebrar apps" }
    })

    expect(new_seg.statusCode).toEqual(200)

    let new_corr = await request(app).post('/corretoras/new').send({
      corretora: { name:"corretinha",  nicknames:["Sobrescrevente"], seguradoras:[ new_seg.body.seguradora._id ] },
      manager: { name:"afonso colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" }
    })


    expect(new_corr.statusCode).toEqual(200)

    let new_path = "ex_sobrescrever.csv"

    let new_request = await request(app).post('/production/new').send({
      seguradora: new_seg.body.seguradora._id,
      path: new_path,
      date: "15/05/2020"
    })

    expect(new_request.statusCode).toEqual(200)

    let overwritten_path = "ex_sobrescrever_2.csv"

    let overwrite_request = await request(app).post('/production/new').send({
      seguradora: new_seg.body.seguradora._id,
      path: overwritten_path,
      date: "15/05/2020"
    })

    // console.log(JSON.stringify(overwrite_request.body, null, 1));

    expect(overwrite_request.statusCode).toEqual(200)

  })

  it('cadastrar nova data de produção', async () => {
    let new_request = await request(app).post(`/production/dates/new`).send({
      year: 2020,
      month: 6,
      dayNumber: 21
    })

    // console.log(JSON.stringify(new_request.body, null, 1));

    expect(new_request.statusCode).toEqual(200)
  })


  it('deveria registrar um caso real de uso da BR infinite nas produções', async () => {

    let new_seg = await request(app).post('/seguradoras/new').send({
      seguradora: { name:"real" },
      manager: { name:"mlk testante", telephone:"999219075", email:"luis@segurateste.com", birthday: "2020-05-01", job:"quebrar apps" }
    })

    let this_seg_id = seg.body.seguradora._id;

    expect(new_seg.statusCode).toEqual(200)

    let new_corr = await request(app).post('/corretoras/new').send({ corretora: { name:"Corretora real",  nicknames:["ABREPE ADMR E CORR DE SEGS LTDA"], seguradoras:[ this_seg_id ] }, manager: { name:"luis colaborante", telephone:"999219075", email:"colaborador@legal.com", birthday: "2020-05-01", job:"testar paradas" } })

    expect(new_corr.statusCode).toEqual(200)

    const entry_request = await request(app).post('/production/new').send({
      seguradora: this_seg_id,
      path: "usoreal.csv",
      date: "15/05/2020"
    })

    console.log(JSON.stringify(entry_request.body, null, 1));

    expect(entry_request.statusCode).toEqual(200)
  })

})
