const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const controller = require('./controller')

describe('colaboradores Routes', () => {
  it('deveria retornar um json maneiro :)', async () => {
    const res = await request(app).get('/colaboradores')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"Message":"Funcionando"});
  })

  it('deveria retornar vazio', async () => {
    const res = await request(app).get('/colaboradores/all')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual([]);
  })

  it('deveria criar um colaborador novo', async () => {
    const res = await request(app).post('/colaboradores/new').send({
      name:"afonso tavarex",
      telephone:"999219075",
      email:"email@legal.com",
      birthday: "today",
      job:"meter o loco"
    })

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"Message":"Colaborador cadastrado com sucesso!"});
  })


  it('deveria pegar o nome do colaborador do banco de dados e modificar', async () => {

    list_colab = await controller.get_colaboradores();

    afonso = list_colab[0];

    expect(afonso.name).toEqual("afonso tavarex");

    const res = await request(app).post(`/colaboradores/${afonso._id}/edit`).send({
      name:"afonso tavares"
    })

    expect(res.statusCode).toEqual(200);

    const colaboradores_req2 = await request(app).get('/colaboradores/all');

    expect(colaboradores_req2.body.length).toEqual(1);

    afonso2 = colaboradores_req2.body[0];

    expect(afonso2.name = "afonso tavares");
  })

})
