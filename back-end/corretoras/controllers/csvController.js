const fs = require('fs');
const csv = require('fast-csv');

const seguradora_controller = require("../../seguradoras/controller")
const colaborador_controller = require('../../colaboradores/controller');

const { get_corretora_by_id, get_corretoras } = require("./defaultController")

async function get_all_corretoras_csv(callback) {

  let my_csv = [];

  let csv_header = []

  csv_header.push("Nome da Corretora")
  csv_header.push("Telefone")
  csv_header.push("Email")
  csv_header.push("Seguradoras")

  my_csv.push(csv_header);

  let this_corrs = await get_corretoras();

  for (var i = 0; i < this_corrs.length; i++) {
    let this_corr = this_corrs[i];

    let csv_corr = []

    csv_corr.push(`${this_corr.name}`)
    csv_corr.push(`${this_corr.telephone}`)
    csv_corr.push(`${this_corr.email}`)

    let this_segs = await seguradora_controller.get_seguradoras_by_id_array(this_corr.seguradoras)

    this_segs = this_segs.map(seg => {
      return seg.name
    })

    csv_corr.push(`${this_segs}`)

    csv_corr = csv_corr.map(field => {
      if (field === "undefined"){
        return ""
      }
      else {
        return field
      }
    })

    my_csv.push(csv_corr);

  }

  let ws = fs.createWriteStream(`./relatorios/corretoras.csv`)

  csv
  .write(my_csv, {headers: false})
  .pipe(ws)
  .on('close', () => {
    callback({
      valid: true,
      path: `corretoras.csv`
    })
  })
  .on('error', () => {
    callback({
      valid: false
    })
  })


}

async function get_corretora_csv(corr_id, callback) {

  let my_csv = [];

  let csv_header = []

  csv_header.push("Nome da Corretora")
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
  csv_header.push("Apelidos")
  csv_header.push("Seguradoras")

  my_csv.push(csv_header);

  let csv_corr = []

  let this_corr = await get_corretora_by_id(corr_id);

  csv_corr.push(`${this_corr.name}`)
  csv_corr.push(`${this_corr.cnpj}`)
  csv_corr.push(`${this_corr.InscricaoEstadual}`)
  csv_corr.push(`${this_corr.email}`)
  csv_corr.push(`${this_corr.telephone}`)
  csv_corr.push(`${this_corr.address.estate}`)
  csv_corr.push(`${this_corr.address.city}`)
  csv_corr.push(`${this_corr.address.street}`)
  csv_corr.push(`${this_corr.address.cep}`)
  csv_corr.push(`${this_corr.address.neighborhood}`)
  csv_corr.push(`${this_corr.address.number}`)
  csv_corr.push(`${this_corr.address.complement}`)
  csv_corr.push(`${this_corr.nicknames}`)

  let this_segs = await seguradora_controller.get_seguradoras_by_id_array(this_corr.seguradoras)

  this_segs = this_segs.map(seg => {
    return seg.name
  })

  csv_corr.push(`${this_segs}`)

  csv_corr = csv_corr.map(field => {
    if (field === "undefined"){
      return ""
    }
    else {
      return field
    }
  })

  my_csv.push(csv_corr);

  let csv_colab_header = []

  csv_colab_header.push("Nome do colaborador")
  csv_colab_header.push("Email")
  csv_colab_header.push("Telefone")
  csv_colab_header.push("Aniversário")

  my_csv.push(csv_colab_header);

  if(this_corr.manager){
    let colab_info = await colaborador_controller.get_colaboradores_corretora(this_corr._id, this_corr.manager._id || this_corr.manager);

    this_corr.colaboradores = colab_info.colaboradores;

    this_corr.manager = colab_info.manager;
  }

  this_corr.colaboradores.push(this_corr.manager)

  for (var i = 0; i < this_corr.colaboradores.length; i++) {
    let csv_colab_line = []

    csv_colab_line.push(`${this_corr.colaboradores[i].name}`)
    csv_colab_line.push(`${this_corr.colaboradores[i].email}`)
    csv_colab_line.push(`${this_corr.colaboradores[i].telephone}`)
    csv_colab_line.push(`${this_corr.colaboradores[i].birthday}`)

    csv_colab_line = csv_colab_line.map(field => {
      if(field === "undefined"){
        return ""
      }else {
        return field
      }
    })

    my_csv.push(csv_colab_line);
  }

  let ws = fs.createWriteStream(`./relatorios/${this_corr.name}.csv`)

  csv
  .write(my_csv, {headers: false})
  .pipe(ws)
  .on('close', () => {
    callback({
      valid: true,
      path: `${this_corr.name}.csv`
    })
  })
  .on('error', () => {
    callback({
      valid: false
    })
  })
}

module.exports = { get_corretora_csv, get_all_corretoras_csv };
