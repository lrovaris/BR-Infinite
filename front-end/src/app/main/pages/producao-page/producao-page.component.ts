import { Component, OnInit } from '@angular/core';
import { SeguradoraService} from "../../services/seguradora.service";
import { Router} from "@angular/router";
import { ProducaoService} from "../../services/producao.service";
import { CorretoraService} from "../../services/corretora.service";
import { DateService} from "../../services/utils/date.service";

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
  filteredCorretorasOfActiveSeguradora = [];

  comparingCorretoras = []
  filteredComparingCorretoras = []

  activeSeguradora: any;
  acumulado = 1000;
  seguradoraName: any;
  arrayWithOldDatesProduction = [];
  corretoraFilter = ""
  isComparing = false;

  constructor(
              private seguradoraService: SeguradoraService,
              private router: Router,
              private producaoService: ProducaoService,
              private corretoraService: CorretoraService,
              private dateService: DateService
  ) { }

  navigateEnviarAnexo() {
    this.router.navigate(['producao/enviar']);
  }

  ngOnInit() {

    this.corretoraFilter = "";

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
        // this.createYearsObjectFromProduction(this.allProducoes);
      });

    })

  } // FIM DO NG ON INIT (bem grandinho ne rs :3)


  filterCorretoras(event){
    this.filteredCorretorasOfActiveSeguradora = this.corretorasOfActiveSeguradora.filter(prod => prod.name.includes(event.target.value));

    this.acumulado = 0;

    for (let i = 0; i < this.filteredCorretorasOfActiveSeguradora.length; i++) {

      this.acumulado = this.acumulado + this.filteredCorretorasOfActiveSeguradora[i].total;

    }
  }

  setActiveSeguradora(id) {

    this.isComparing = false;

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
      let corretoraProductionArray = activeSeguradoraProductionsArray.filter(prod => prod.corretora._id === allCorretoras[i]);

      this.corretorasOfActiveSeguradora.push(this.getCorretoraLineInfo(allCorretoras[i], corretoraProductionArray))
    }

    for (let i = 0; i < this.corretorasOfActiveSeguradora.length; i++) {

      this.acumulado = this.acumulado + this.corretorasOfActiveSeguradora[i].total;

    }

    this.filteredCorretorasOfActiveSeguradora = this.corretorasOfActiveSeguradora;
  }


  getCorretoraLineInfo(id, corretoraProductionArray) {
    let dateToReturn = corretoraProductionArray[0].date;
    let nameToReturn = corretoraProductionArray[0].corretora.name;
    let totalToReturn = corretoraProductionArray[0].total;
    let projectionToReturn = 0;

   let montanteAdicional = 0;

   let timesCounted = 0;

   let media: number;

    for (let i = 0; i < corretoraProductionArray.length; i++) {

      if (this.dateService.isTheNewDateBigger(dateToReturn, corretoraProductionArray[i].date)) {
        dateToReturn = corretoraProductionArray[i].date;

        montanteAdicional = montanteAdicional + (corretoraProductionArray[i].total - totalToReturn);

        totalToReturn = corretoraProductionArray[i].total;

        timesCounted++

      }
    }

    // numeros dia dias uteis no mes é 20
    // numero total de dias aproximado é 30
    // portanto o numero de dias inuteis deve ser 10
    // o numero de dias uteis faltando deve ser 30 - dataAtual - valor de dias inuteis restantes
    // e o valor de dias inuteis restantes é igual a (30 - dataAtual) / 3

    media = montanteAdicional / timesCounted;

    let diasFaltando = ((30 - this.dateService.getDateInfoFromString(dateToReturn).day) * 2) / 3;

    projectionToReturn = (diasFaltando * media) + totalToReturn;

    return {
      media: media.toFixed(),
      name: nameToReturn,
      date: dateToReturn,
      total: totalToReturn,
      projection: projectionToReturn.toFixed(),
      production: corretoraProductionArray,
      _id: id
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


  compararComDiaAnterior(){
    let biggerDate = this.filteredCorretorasOfActiveSeguradora[0].date

    for (let index = 0; index < this.filteredCorretorasOfActiveSeguradora.length; index++) {
      if(this.dateService.isTheNewDateBigger(biggerDate, this.filteredCorretorasOfActiveSeguradora[index].date)){
        biggerDate = this.filteredCorretorasOfActiveSeguradora[index].date
      }
    }

    let dateInfo = this.dateService.getDateInfoFromString(biggerDate)

    dateInfo.day -= 1;
    let biggerDateMinusOne = this.dateService.getDateStringFromInfo(dateInfo);

    dateInfo.day = 1;
    let monthStart = this.dateService.getDateStringFromInfo(dateInfo)

    let compareInfo = this.filteredCorretorasOfActiveSeguradora.map( corrInfo => {

      let thisYearsObj = this.dateService.createYearsObjectFromProduction(corrInfo.production)

      let prod_ids = this.dateService.getProductionArrayFromDateInfoInterval(this.dateService.getDateInfoFromString(monthStart), this.dateService.getDateInfoFromString(biggerDateMinusOne), thisYearsObj);

      let prods = prod_ids.map(prod_id => {
        return this.allProducoes.find(prod_obj => prod_obj._id.toString() === prod_id);
      })

      let lastDayInfo = this.getCorretoraLineInfo(corrInfo._id, prods);

      return {
        today: corrInfo,
        lastDay: lastDayInfo
      };
    });


    this.isComparing = true;

    // no componente
    // caso exista, mostrar a comparação

    this.comparingCorretoras = compareInfo
    this.filteredComparingCorretoras = this.comparingCorretoras

    // se não existir, dar feedback visual




  }

}
