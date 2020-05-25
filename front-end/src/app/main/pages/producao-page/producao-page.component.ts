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
        console.log(this.allProducoes);
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
        console.log(this.allProducoes);
        this.calculateDatesCorretora(this.allProducoes);
      });

    })

  } // FIM DO NG ON INIT (bem grandinho ne rs :3)




  setActiveSeguradora(id) {

    this.acumulado = 0;

    this.corretorasOfActiveSeguradora = [];

    this.activeSeguradora = id;

    for (let i = 0; i < this.allProducoes.length; i++) {

      if (this.allProducoes[i].seguradora._id === this.activeSeguradora) {

        this.seguradoraName = this.allProducoes[i].seguradora.name;

        if (this.corretorasOfActiveSeguradora.length === 0) {

          this.corretorasOfActiveSeguradora.push(this.allProducoes[i]);

        } else {

          let corretora = this.corretorasOfActiveSeguradora.find(cor => this.allProducoes[i].corretora._id === cor.corretora._id);

          if (corretora === undefined) {

            this.corretorasOfActiveSeguradora.push(this.allProducoes[i]);

          } else {

            if (this.isTheNewDateBigger(corretora.date, this.allProducoes[i].date)) {

              let index = this.corretorasOfActiveSeguradora.indexOf(corretora);
              if (index !== -1) this.corretorasOfActiveSeguradora.splice(index, 1);
              this.corretorasOfActiveSeguradora.push(this.allProducoes[i]);

            }

          }

        }

      }

    }

    console.log(this.corretorasOfActiveSeguradora);
    console.log(this.arrayWithOldDatesProduction);

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

      if (Object.entries(yearsObject).length === 0) {

        let year = currentDate.anoInfo;

        yearsObject[year] = {};

      } else {
        let allYears = Object.entries(yearsObject)
      }

    }
    console.log(yearsObject)
  }

  getDateInfo(date) {
    return {
      diaInfo: date.split("/")[0],
      mesInfo: date.split("/")[1],
      anoInfo: date.split("/")[2]
    }
  }

  isTheNewDateBigger(oldDate, NewDate) {

    let dataNew = this.getDateInfo(NewDate);

    let dataOld = this.getDateInfo(oldDate);

    // SEPARACAO DAS DATAS EM DIA MES E ANO PARA AS COMPARACOES



    // SEPARACAO DAS DATAS EM DIA MES E ANO PARA AS COMPARACOES

    if (dataNew.anoInfo < dataOld.anoInfo) {

      return false // ANO DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

    } else if ( (dataNew.anoInfo >= dataOld.anoInfo) ) {

      if (dataNew.mesInfo < dataOld.mesInfo) {

        return false  // MES DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

      } else if ( dataNew.mesInfo >= dataOld.mesInfo) {

        if (dataNew.diaInfo < dataOld.diaInfo) {

          return false   // DIA DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

        } else if ( dataNew.diaInfo > dataOld.diaInfo ) {

          return true

        }

        if (dataNew.mesInfo > dataOld.mesInfo) {
          return true
        }

      }

      return dataNew.anoInfo > dataOld.anoInfo;

    }


  }



}
