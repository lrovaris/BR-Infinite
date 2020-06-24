const fs = require('fs');
const csv = require('fast-csv');

const colaborador_controller = require('../../colaboradores/controller');

const { get_seguradora_by_id, get_filtered_seguradoras } = require("./defaultController")

async function get_all_seguradoras_csv(filters, callback) {


  let my_csv = [];

  let csv_header = []

  csv_header.push("Nome da seguradora")
  csv_header.push("Telefone filial")
  csv_header.push("Gerente filial")
  csv_header.push("Telefone Gerente")

  my_csv.push(csv_header);

  let this_segs = await get_filtered_seguradoras(filters);

  if(!this_segs.valid){
    this_segs.status = 400

    return callback(this_segs)
  }else {
    this_segs = this_segs.data
  }

  for (var i = 0; i < this_segs.length; i++) {
    let this_seg = this_segs[i];

    let csv_seg = []

    csv_seg.push(`${this_seg.name}`)
    csv_seg.push(`${this_seg.telephone}`)


    if(this_seg.manager === undefined){
      csv_seg.push(``)
      csv_seg.push(``)
    }else {
      csv_seg.push(`${this_seg.manager.name}`)
      csv_seg.push(`${this_seg.manager.telephone}`)
    }

    csv_seg = csv_seg.map(field => {
      if (field === "undefined"){
        return ""
      }
      else {
        return field
      }
    })

    my_csv.push(csv_seg);

  }

  let ws = fs.createWriteStream(`./relatorios/seguradoras.csv`)

  csv
  .write(my_csv, {headers: false})
  .pipe(ws)
  .on('close', () => {
    return callback({
      valid: true,
      path: `seguradoras.csv`
    })
  })
  .on('error', () => {
    return callback({
      valid: false,
      status: 500,
      message: "Erro interno do servidor"
    })
  })


}

async function get_seguradora_csv(seg_id, callback) {

  let my_csv = [];

  let csv_header = []

  csv_header.push("Nome da Seguradora")
  csv_header.push("CNPJ")
  csv_header.push("Inscrição estadual")
  csv_header.push("Email")
  csv_header.push("Telefone")
  csv_header.push("UF")
  csv_header.push("Cidade")
  csv_header.push("Rua")
  csv_header.push("CEP")
  csv_header.push("Bairro")
  csv_header.push("Número")
  csv_header.push("Complemento")

  my_csv.push(csv_header);

  let csv_seg = []

  let this_seg = await get_seguradora_by_id(seg_id);

  csv_seg.push(`${this_seg.name}`)
  csv_seg.push(`${this_seg.cnpj}`)
  csv_seg.push(`${this_seg.InscricaoEstadual}`)
  csv_seg.push(`${this_seg.email}`)
  csv_seg.push(`${this_seg.telephone}`)
  csv_seg.push(`${this_seg.address.estate}`)
  csv_seg.push(`${this_seg.address.city}`)
  csv_seg.push(`${this_seg.address.street}`)
  csv_seg.push(`${this_seg.address.cep}`)
  csv_seg.push(`${this_seg.address.neighborhood}`)
  csv_seg.push(`${this_seg.address.number}`)
  csv_seg.push(`${this_seg.address.complement}`)

  csv_seg = csv_seg.map(field => {
    if (field === "undefined"){
      return ""
    }
    else {
      return field
    }
  })

  my_csv.push(csv_seg);

  let csv_colab_header = []

  csv_colab_header.push("Nome do colaborador")
  csv_colab_header.push("Email")
  csv_colab_header.push("Telefone")
  csv_colab_header.push("Aniversário")

  my_csv.push(csv_colab_header);

  if(this_seg.manager){
    let colab_info = await colaborador_controller.get_colaboradores_seguradora(this_seg._id, this_seg.manager._id || this_seg.manager);

    this_seg.colaboradores = colab_info.colaboradores;

    this_seg.manager = colab_info.manager;
  }

  this_seg.colaboradores.push(this_seg.manager)

  for (var i = 0; i < this_seg.colaboradores.length; i++) {
    let csv_colab_line = []

    csv_colab_line.push(`${this_seg.colaboradores[i].name}`)
    csv_colab_line.push(`${this_seg.colaboradores[i].email}`)
    csv_colab_line.push(`${this_seg.colaboradores[i].telephone}`)
    csv_colab_line.push(`${this_seg.colaboradores[i].birthday}`)

    csv_colab_line = csv_colab_line.map(field => {
      if(field === "undefined"){
        return ""
      }else {
        return field
      }
    })

    my_csv.push(csv_colab_line);
  }

  let ws = fs.createWriteStream(`./relatorios/${this_seg.name}.csv`)

  csv
  .write(my_csv, {headers: false})
  .pipe(ws)
  .on('close', () => {
    callback({
      valid: true,
      path: `${this_seg.name}.csv`
    })
  })
  .on('error', () => {
    callback({
      valid: false
    })
  })
}

module.exports = { get_seguradora_csv, get_all_seguradoras_csv };
