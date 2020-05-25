import { Component, OnInit } from '@angular/core';
import { SeguradoraService} from "../../services/seguradora.service";
import { Router} from "@angular/router";
import { ProducaoService} from "../../services/producao.service";
import { CorretoraService} from "../../services/corretora.service";

@Component({
  selector: 'app-producao-page',
  templateUrl: './producao-page.component.html',
  styleUrls: ['./producao-page.component.scss']
})
export class ProducaoPageComponent implements OnInit {

  allSeguradoras = [];
  allProducoes = [];
  seguradora = [];
  corretora = [];
  corretorasOfActiveSeguradora = [];
  activeSeguradora: any;
  acumulado = 1000;
  seguradoraName: any;
  arrayWithOldDatesProduction = [];

  constructor(
              private seguradoraService: SeguradoraService,
              private router: Router,
              private producaoService: ProducaoService,
              private corretoraService: CorretoraService
  ) { }

  navigateEnviarAnexo() {
    this.router.navigate(['producao/enviar']);
  }

  ngOnInit() {



    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.allSeguradoras = data;
    });

    this.producaoService.getAllProducao().subscribe((data: any) => {
      this.allProducoes = data;
      this.seguradoraService.getAllSeguradoras().subscribe((seg_data:any) => {
        this.seguradora = seg_data;
        this.allProducoes = this.allProducoes.map(prod => {
            let seg = this.seguradora.find(seg_obj => prod.seguradora.toString() === seg_obj._id.toString());
           let seguradora = {
              name: seg.name,
              _id: seg._id,
              telephone: seg.telephone,
              email: seg.email
            };
          prod.seguradora = seguradora;
          return prod;
        });
      });
      this.corretoraService.getAllCorretoras().subscribe((cor_data:any) => {
        this.corretora = cor_data;
        this.allProducoes = this.allProducoes.map(prod => {
          let cor = this.corretora.find(cor_obj => prod.corretora.toString() === cor_obj._id.toString());
          let corretora = {
            name: cor.name,
            _id: cor._id,
            telephone: cor.telephone,
            email: cor.email
          };
          prod.corretora = corretora;
          return prod;
        });
        // this.calculateDatesCorretora(this.allProducoes);
      });

    })

  } // FIM DO NG ON INIT (bem grandinho ne rs :3)


  getCorretoraLineInfo(id, seguradoraProductionArray) {
   let corretoraProductionArray = [];
    for (let i = 0; i < seguradoraProductionArray.length; i++) {
      if (seguradoraProductionArray[i].corretora._id === id) {
        corretoraProductionArray.push(seguradoraProductionArray[i]);
      }
    }

    let dateToReturn = corretoraProductionArray[0].date;
    let nameToReturn = corretoraProductionArray[0].corretora.name;
    let totalToReturn = corretoraProductionArray[0].total;
    let projectionToReturn = 0;

   let corretoraDates = this.calculateDatesCorretora(corretoraProductionArray);

   console.log(corretoraDates);

   let montanteAdicional = 0;

   let timesCounted = 0;

   let media: number;

   let minorDate = corretoraProductionArray[0].date;

    for (let i = 0; i < corretoraProductionArray.length; i++) {

      if (this.isTheNewDateBigger(dateToReturn, corretoraProductionArray[i].date)) {
        dateToReturn = corretoraProductionArray[i].date;

        montanteAdicional = montanteAdicional + (corretoraProductionArray[i].total - totalToReturn);

        totalToReturn = corretoraProductionArray[i].total;

        console.log(montanteAdicional);
        timesCounted++

      }

      /*if (!this.isTheNewDateBigger(minorDate, corretoraProductionArray[i].date)) {
        minorDate = corretoraProductionArray[i].date
      }*/

    }

    // numeros dia dias uteis no mes é 20
    // numero total de dias aproximado é 30
    // portanto o numero de dias inuteis deve ser 10
    // o numero de dias uteis faltando deve ser 30 - dataAtual - valor de dias inuteis restantes
    // e o valor de dias inuteis restantes é igual a (30 - dataAtual) / 3



    console.log('-------');
    media = montanteAdicional / timesCounted;
    console.log(media);
    console.log('-------');



    let diasFaltando = ((30 - this.getDateInfo(dateToReturn).day) * 2) / 3;
    console.log(diasFaltando.toFixed());

    projectionToReturn = (diasFaltando * media) + totalToReturn;

    return {
      media: media.toFixed(),
      name: nameToReturn,
      date: dateToReturn,
      total: totalToReturn,
      projection: projectionToReturn.toFixed()
    }
  }

  setActiveSeguradora(id) {

    this.acumulado = 0;

    this.corretorasOfActiveSeguradora = [];

    this.activeSeguradora = id;

    let activeSeguradoraProductionsArray = [];

    for (let i = 0; i < this.allProducoes.length; i++) {
      if (this.allProducoes[i].seguradora._id === this.activeSeguradora) {
        activeSeguradoraProductionsArray.push(this.allProducoes[i]);
      }
    }

    this.seguradoraName = activeSeguradoraProductionsArray[0].seguradora.name;

    let allCorretoras = [];

    for (let i = 0; i < activeSeguradoraProductionsArray.length; i++) {
      let corretora = allCorretoras.find(cor => activeSeguradoraProductionsArray[i].corretora._id === cor);

      if (corretora === undefined) {

        allCorretoras.push(activeSeguradoraProductionsArray[i].corretora._id);

      }
    }

    this.corretorasOfActiveSeguradora = [];


    for (let i = 0; i < allCorretoras.length; i++) {
      this.corretorasOfActiveSeguradora.push(this.getCorretoraLineInfo(allCorretoras[i], activeSeguradoraProductionsArray))
    }

    for (let i = 0; i < this.corretorasOfActiveSeguradora.length; i++) {

      this.acumulado = this.acumulado + this.corretorasOfActiveSeguradora[i].total;

    }

  }

  /*
  TODO corretora: {name: "Corretora corretora", _id: "5ec820471b5b4a1ff5feb995", telephone: "", email: ""}
  TODO date: "14/05/2020"
  TODO seguradora: {name: "teste abcd", _id: "5ec7dfcf1b5b4a1ff5feb991", telephone: null, email: null}
  TODO sentDate: "2020-05-22T18:58:35.649Z"
  TODO total: 1200
  TODO _id: "5ec820db1b5b4a1ff5feb999"
  */





  calculateDatesCorretora(corretoraProduction) {

    let yearsObject: Object = {};

    for (let i = 0; i < corretoraProduction.length; i++) {

      let currentDate = this.getDateInfo(corretoraProduction[i].date);

      yearsObject = this.makedataobj(currentDate, yearsObject);

    }
   return yearsObject;
  }

  getDateInfo(date) {
    return {
      day: date.split("/")[0],
      month: date.split("/")[1],
      year: date.split("/")[2]
    }
  }

  isTheNewDateBigger(oldDate, NewDate) {

    let dataNew = this.getDateInfo(NewDate);

    let dataOld = this.getDateInfo(oldDate);

    // SEPARACAO DAS DATAS EM DIA MES E ANO PARA AS COMPARACOES



    // SEPARACAO DAS DATAS EM DIA MES E ANO PARA AS COMPARACOES

    if (dataNew.year < dataOld.year) {

      return false // ANO DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

    } else if ( (dataNew.year >= dataOld.year) ) {

      if (dataNew.month < dataOld.month) {

        return false  // MES DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

      } else if ( dataNew.month >= dataOld.month) {

        if (dataNew.day < dataOld.day) {

          return false   // DIA DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

        } else if ( dataNew.day > dataOld.day ) {

          return true

        }

        if (dataNew.month > dataOld.month) {
          return true
        }

      }

      return dataNew.year > dataOld.year;

    }


  }



  makedataobj(new_data, yearsObj) {

    let yearsArray = Object.entries(yearsObj);

    if(yearsArray.length === 0){

      yearsObj[new_data.year] = {}

    }else {

      let currentYearObj = yearsArray.find(year_obj => year_obj[0] === new_data.year)

      if(currentYearObj !== undefined){
        let monthsArray = Object.entries(currentYearObj[1]);

        if(monthsArray.length === 0){

          yearsObj[new_data.year][new_data.month] = [new_data.day]

        }else {

          let currentMonthObj = monthsArray.find(month_obj => month_obj[0] ===new_data.month)

          if(currentMonthObj !== undefined){

            let daysArray = currentMonthObj[1];

            if (daysArray.length === 0) {
              yearsObj[new_data.year][new_data.month].push(new_data.day);
            }

            else if(!daysArray.includes(new_data.day)){

              yearsObj[new_data.year][new_data.month].push(new_data.day);

            }
          }else {
            yearsObj[new_data.year][new_data.month] = [new_data.day]
          }
        }
      }
      else{
        yearsObj[new_data.year] = {}
        yearsObj[new_data.year][new_data.month] = [new_data.day]
      }
    }
    return yearsObj;
  }


}
