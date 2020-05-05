const request = require('supertest')
const app = require('../server')
const routes = require('./routes');

describe('User Routes', () => {

  it('deveria retornar vazio', async () => {
    const res = await request(app).get('/users/all')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual([]);

  })

  it('deveria falhar em criar um usuário novo', async () => {
    const res = await request(app).post('/users/new').send({
      login:"",
      name:"afonso tavarex",
      password:"123456"
    })

    expect(res.statusCode).toEqual(400)

    expect(res.body).toEqual({"message":"Campo de login vazio"});
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

  it('deveria retornar um usuário', async () => {
    const res = await request(app).get('/users/all')

    expect(res.statusCode).toEqual(200)

    expect(res.body.length).toEqual(1);

  })

  it('deveria retornar um erro de usuário em uso', async () => {
    const res = await request(app).post('/users/new').send({
      login:"afonso",
      name:"afonso outro",
      password:"123456"
    })

    expect(res.statusCode).toEqual(400)

    expect(res.body).toEqual({"message":"Este nome de usuário já está em uso"});
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

  it('deveria falhar em modificar um usuário', async () => {
    const res = await request(app).post(`/users/9/edit`).send({
      login:"afonso",
      name:"afonso tavares",
      password:"123456"
    })

    expect(res.statusCode).toEqual(400);

    expect(res.body).toEqual({"message":"Usuário inválido"});
  })

  it('deveria logar o usuário', async () => {
    const res = await request(app).post('/users/login').send({
      login:"afonso",
      password:"123456"
    })

    expect(res.statusCode).toEqual(200);
  })
})
