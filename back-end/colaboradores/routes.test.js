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
      birthday: "today"
    })

    expect(res.statusCode).toEqual(400)

    expect(res.body.message).toEqual("Campo de cargo vazio");
  })

  it('deveria criar um colaborador novo', async () => {
    const res = await request(app).post('/colaboradores/new').send({
      name:"afonso tavarex",
      telephone:"999",
      email:"email@legal.com",
      birthday: "today",
      job:"meter o loco"
    })

    expect(res.statusCode).toEqual(200)

    expect(res.body.message).toEqual("Colaborador cadastrado com sucesso!");
  })


  it('deveria pegar o nome do colaborador do banco de dados e modificar', async () => {

    let list_colab = await controller.get_colaboradores();


    let afonso = list_colab.find(a =>  {
      return a.telephone === "999"
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

})
