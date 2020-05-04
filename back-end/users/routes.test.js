const request = require('supertest')
const app = require('../server')
const routes = require('./routes');

describe('User Routes', () => {
  it('deveria retornar um json maneiro :)', async () => {
    const res = await request(app).get('/users')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"message":"Funcionando"});

  })

  it('deveria falhar em logar o usuário', async () => {
    const res = await request(app).post('/users/login').send({
      login:"afonso",
      password:"123456"
    })

    expect(res.statusCode).toEqual(503)

    expect(res.body).toEqual({"message":"Servidor inicializando"});
  })


  it('deveria retornar vazio', async () => {
    const res = await request(app).get('/users/all')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual([]);

  })

  it('deveria criar um usuário novo', async () => {
    const res = await request(app).post('/users/new').send({
      login:"afonso",
      name:"afonso tavarex",
      password:"123456"
    })

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"message":"Usuário criado com sucesso!"});
  })

  it('deveria retornar vazio', async () => {
    const res = await request(app).get('/users/all')

    expect(res.statusCode).toEqual(200)

    expect(res.body.length).toEqual(1);

  })

  it('deveria pegar o nome do usuário do banco de dados e modificar', async () => {

    const users_req = await request(app).get('/users/all');

    afonso = users_req.body[0];

    expect(afonso.name).toEqual("afonso tavarex");

    const res = await request(app).post(`/users/${afonso._id}/edit`).send({
      login:"afonso",
      name:"afonso tavares",
      password:"123456"
    })

    expect(res.statusCode).toEqual(200);

    const users_req2 = await request(app).get('/users/all');

    expect(users_req2.body.length).toEqual(1);

    afonso2 = users_req2.body[0];

    expect(afonso2.name = "afonso tavares");
  })

  it('deveria logar o usuário', async () => {
    const res = await request(app).post('/users/login').send({
      login:"afonso",
      password:"123456"
    })

    expect(res.statusCode).toEqual(200);
  })
})
