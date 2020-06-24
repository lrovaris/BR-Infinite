const request = require('supertest')
const app = require('../server')
const routes = require('./routes');
const db = require('../db');
const controller = require('./controller')

const corretora_controller = require('../corretoras/controller')
const colaborador_controller = require('../colaboradores/controller')
const product_controller = require('../products/controller')
const seguradora_controller = require('../seguradoras/controller')

describe('Rotas das oportunidades', () => {
  let dummy_seg
  let dummy_corr
  let dummy_colab
  let dummy_prod

  beforeAll(async()=>{
    dummy_seg = await seguradora_controller.register_seguradora({ "name":"segurateste" })
    dummy_corr = await corretora_controller.register_corretora({ "name":"correteste" });
    dummy_colab = await colaborador_controller.register_colaborador({ "name":"testôncio"});
    dummy_prod = await product_controller.register_produto({"name":"produteste"});
  })





  it('deveria retornar um json maneiro :)', async () => {
    const res = await request(app).get('/opportunities')

    expect(res.statusCode).toEqual(200)

    expect(res.body).toEqual({"message":"Funcionando"});
  })


  it('deveria falhar em criar uma oportunidade ', async () => {

    const res = await request(app).post('/opportunities/new').send({
      inclusionDate: "05-05-2020",
      corretora: dummy_corr._id,
      colaborador: dummy_colab._id,
      proponente: "true",
      product: dummy_prod._id,
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
      seguradora: dummy_seg._id,
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
      corretora: dummy_corr._id,
      colaborador: dummy_colab._id,
      proponente: "true",
      product: dummy_prod._id,
      description: "sem desc",
      dealType: "renovacao",
      congenereRenewal: "concorrente safado",
      vigencia: "06-06-06",
      congenereList: ['{ "name": "concorrente safado", "price": "preço do concorrente safado", "comission": "comissão do concorrente safado" }'],
      seguradora: dummy_seg._id,
      seguradoraPrice: "duzentao",
      seguradoraComission: "8%",
      status: "fechado caraaai"
    })

    expect(res.body).toEqual({"message":"Oportunidade cadastrada com sucesso!"});

    expect(res.statusCode).toEqual(200)
  })

  it('deveria criar uma oportunidade nova', async () => {
    const res = await request(app).post('/opportunities/new').send({
      inclusionDate: "05-05-2020",
      corretora: dummy_corr._id,
      colaborador: dummy_colab._id,
      proponente: "true",
      product: dummy_prod._id,
      description: "descricao do negocio",
      dealType: "renovacao",
      congenereRenewal: "concorrente safado",
      vigencia: "06-06-06",
      congenereList: [],
      seguradora: dummy_seg._id,
      seguradoraPrice: "duzentao",
      seguradoraComission: "8%",
      status: "fechado caraaai"
    })

    expect(res.body).toEqual({"message":"Oportunidade cadastrada com sucesso!"});

    expect(res.statusCode).toEqual(200)
  })


  it('deveria pegar o nome do colaborador do banco de dados e modificar', async () => {

    let list_opp = await controller.get_opportunities();

    let oportunidade = list_opp.find(a =>  {
      return a.seguradora.toString() === dummy_seg._id.toString()
    });

    expect(oportunidade.dealType).toEqual("renovacao");

    const res = await request(app).post(`/opportunities/${oportunidade._id}/edit`).send({
      dealType:"nova opp"
    })

    expect(res.statusCode).toEqual(200);

    let list_opp2 = await controller.get_opportunities();

    expect(list_opp2.length).toEqual(list_opp.length);

    let oportunidade2 = list_opp2.find(a =>  {
      return a.seguradora.toString() === dummy_seg._id.toString()
    });

      expect(oportunidade2.dealType).toEqual("nova opp");
  })

  it('filtros pipeline', async() => {
    const new_request = await request(app).post(`/opportunities/filter`).send({
      filters:[
        {
          type:"vigenciaAfter",
          value:"05-04-2020"
        }
      ]
    })

    // console.log(JSON.stringify(new_request.body, null, 1));

    expect(new_request.status).toEqual(200);
  })

})
