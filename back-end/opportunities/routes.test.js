const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const db = require('../db');
const controller = require('./controller')

describe('Rotas das oportunidades', () => {
  it('deveria retornar um json maneiro :)', async () => {
    const res = await request(app).get('/opportunities')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"message":"Funcionando"});
  })


  it('deveria falhar em criar uma oportunidade ', async () => {
    const res = await request(app).post('/opportunities/new').send({
      inclusionDate: "05-05-2020",
      corretora: "id123123",
      colaborador: "id123123",
      proponente: "true",
      product: "id123123",
      vigencia: "06-06-06",
      congenereList: [
        {
          name: "concorrente safado",
          price: "preço do concorrente safado",
          comission: "comissão do concorrente safado"
        },
        {
          name: "concorrente safado",
          price: "preço do concorrente safado",
          comission: "comissão do concorrente safado"
        }
      ],
      seguradora: "id123123",
      seguradoraPrice: "duzentao",
      seguradoraComission: "8%",
      status: "fechado caraaai"
    })

    expect(res.body).toEqual({"message":"Descrição inválida"});

    expect(res.statusCode).toEqual(400)
  })


  it('deveria criar uma oportunidade nova', async () => {
    const res = await request(app).post('/opportunities/new').send({
      inclusionDate: "05-05-2020",
      corretora: "id123123",
      colaborador: "id123123",
      proponente: "true",
      product: "id123123",
      description: "descricao do negocio",
      dealType: "renovacao",
      congenereRenewal: "concorrente safado",
      vigencia: "06-06-06",
      congenereList: ['{ "name": "concorrente safado", "price": "preço do concorrente safado", "comission": "comissão do concorrente safado" }'],
      seguradora: "id123123",
      seguradoraPrice: "duzentao",
      seguradoraComission: "8%",
      status: "fechado caraaai"
    })

    expect(res.body).toEqual({"message":"Oportunidade cadastrado com sucesso!"});

    expect(res.statusCode).toEqual(200)
  })

  it('deveria criar uma oportunidade nova', async () => {
    const res = await request(app).post('/opportunities/new').send({
      inclusionDate: "05-05-2020",
      corretora: "id123123",
      colaborador: "id123123",
      proponente: "true",
      product: "id123123",
      description: "descricao do negocio",
      dealType: "renovacao",
      congenereRenewal: "concorrente safado",
      vigencia: "06-06-06",
      congenereList: [],
      seguradora: "id123123",
      seguradoraPrice: "duzentao",
      seguradoraComission: "8%",
      status: "fechado caraaai"
    })

    expect(res.body).toEqual({"message":"Oportunidade cadastrado com sucesso!"});

    expect(res.statusCode).toEqual(200)
  })


  it('deveria pegar o nome do colaborador do banco de dados e modificar', async () => {

    let list_opp = await controller.get_opportunities();

    oportunidade = list_opp.find(a =>  {
      return a.seguradora === "id123123"
    });

    expect(oportunidade.dealType).toEqual("renovacao");

    const res = await request(app).post(`/opportunities/${oportunidade._id}/edit`).send({
      dealType:"nova opp"
    })

    expect(res.statusCode).toEqual(200);

    let list_opp2 = await controller.get_opportunities();

    expect(list_opp2.length).toEqual(list_opp.length);

    oportunidade2 = list_opp2.find(a =>  {
      return a.seguradora === "id123123"
    });

      expect(oportunidade2.dealType).toEqual("nova opp");
  })

})
