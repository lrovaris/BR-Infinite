const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const controller = require('./controller')
const db = require('../db')

describe('colaboradores Routes', () => {
  it('deveria falhar em criar um colaborador', async () => {
    const res = await request(app).post('/colaboradores/new').send({
      name:"afonso tavarex",
      telephone:"999",
      email:"email@legal.com",
      birthday: "1521-12-12"
    })

    expect(res.statusCode).toEqual(400)

    expect(res.body.message).toEqual("Campo de cargo vazio");
  })

  it('deveria criar um colaborador novo', async () => {
    const res = await request(app).post('/colaboradores/new').send({
      name:"afonso tavarex",
      telephone:"999",
      email:"email@legal.com",
      birthday: "1521-12-12",
      job:"QA"
    })

    expect(res.statusCode).toEqual(200)

    expect(res.body.message).toEqual("Colaborador cadastrado com sucesso!");
  })


  it('deveria pegar o nome do colaborador do banco de dados e modificar', async () => {

    let list_colab = await controller.get_colaboradores();


    let afonso = list_colab.find(colab =>  {
      return colab.telephone === "999"
    });

    expect(afonso.name).toEqual("afonso tavarex");

    const res = await request(app).post(`/colaboradores/${afonso._id}/edit`).send({
      name:"afonso tavares"
    })

    expect(res.statusCode).toEqual(200);

    const colaboradores_req2 = await request(app).get('/colaboradores/all');


    afonso2 = colaboradores_req2.body.find(a =>  {
      return a.telephone === "999"
    });

    expect(afonso2.name).toEqual("afonso tavares");
  })

  it('deveria retornar uma lista com os aniversariantes do mês', async () => {
    let new_colab = await request(app).post('/colaboradores/new').send({
      name:"rapazin",
      telephone:"999999999",
      email:"email@legal.com",
      birthday: `1521-${(new Date().getMonth() + 1)}-12`,
      job:"QA"
    })

    const res = await request(app).get(`/colaboradores/birthday`)

    expect(res.statusCode).toEqual(200);
  })

  it('deveria retornar uma lista com os aniversariantes do mês de novembro', async () => {
    let new_colab = await request(app).post('/colaboradores/new').send({
      name:"rapazin",
      telephone:"999999999",
      email:"email@legal.com",
      birthday: `1521-11-12`,
      job:"QA"
    })

    const res = await request(app).post(`/colaboradores/birthday`).send({
      month: 11
    })

    // console.log(JSON.stringify(res.body));

    expect(res.statusCode).toEqual(200);
  })

})
