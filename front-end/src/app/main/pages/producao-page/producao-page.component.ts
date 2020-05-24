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

    console.log(this.isTheNewDateBigger('11/02/2020', '11/02/2020'));

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
      });

    })

  } // FIM DO NG ON INIT (bem grandinho ne rs :3)




  setActiveSeguradora(id) {

    this.corretorasOfActiveSeguradora = [];

    this.activeSeguradora = id;

    for (let i = 0; i < this.allProducoes.length; i++) {

      if (this.allProducoes[i].seguradora._id === this.activeSeguradora) {

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

  }

  isTheNewDateBigger(oldDate, NewDate) {

    let dataNew = NewDate;

    let dataOld = oldDate;

    // SEPARACAO DAS DATAS EM DIA MES E ANO PARA AS COMPARACOES

    let anoNew  = dataNew.split("/")[0];
    let mesNew  = dataNew.split("/")[1];
    let diaNew  = dataNew.split("/")[2];

    let anoOld  = dataOld.split("/")[0];
    let mesOld  = dataOld.split("/")[1];
    let diaOld  = dataOld.split("/")[2];

    // SEPARACAO DAS DATAS EM DIA MES E ANO PARA AS COMPARACOES


    if (anoNew < anoOld) {

      return false // ANO DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

    } else if ( (anoNew >= anoOld) ) {

      if (mesNew < mesOld) {

        return false  // MES DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

      } else if ( mesNew >= mesOld) {

        if (diaNew < diaOld) {

          return false   // DIA DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

        } else if ( diaNew > diaOld ) {

          return true

        }

        if (mesNew > mesOld) {
          return true
        }

      }

      return anoNew > anoOld;

    }


  }



}
