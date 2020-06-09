import { Component, OnInit } from '@angular/core';
import {CorretoraService} from "../../../../services/corretora.service";
import {Router} from "@angular/router";
import {ProducaoService} from "../../../../services/producao.service";
import {DateService} from "../../../../services/utils/date.service";

@Component({
  selector: 'app-producao-corretora-anual',
  templateUrl: './producao-corretora-anual.component.html',
  styleUrls: ['./producao-corretora-anual.component.scss']
})
export class ProducaoCorretoraAnualComponent implements OnInit {


  reportsArray = [];
  saveOldReport = [];

  tipoRelatorio = 'padrao';
  corretoraName = 'Corretora';
  selectedMonthStart = '';
  selectedYearStart = '';
  selectedMonthEnd = '';
  selectedYearEnd = '';

  variacao: any;

  corretoraFilter = '';
  allCorretoras = [];

  corretoraDates = [];

  corretora = [];

  activeCorretora = '';

  allProducoes = [];

  monthsArrayStart = [];
  monthsArrayEnd = [];

  selectedYear: any;

  monthsArray = [];

  constructor(
    private corretoraService: CorretoraService,
    private router: Router,
    private producaoService: ProducaoService,
    private dateService: DateService
  ) { }


  ngOnInit() {

    this.corretoraFilter = "";

    this.corretoraService.getAllCorretoras().subscribe((data:any) => {
      this.allCorretoras = data;
      this.setActiveCorretora(this.allCorretoras[0]._id);
    });

    this.producaoService.getAllProducao().subscribe((data: any) => {
      this.allProducoes = data;
      this.corretoraService.getAllCorretoras().subscribe((seg_data:any) => {
        this.corretora = seg_data;
        this.allProducoes = this.allProducoes.map(prod => {
          let seg = this.corretora.find(seg_obj => prod.corretora.toString() === seg_obj._id.toString());
          let corretora = {
            name: seg.name,
            _id: seg._id,
            telephone: seg.telephone,
            email: seg.email
          };
          prod.corretora = corretora;
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

    console.log(event.target.value.toLowerCase());

    if(event.target.value.toLowerCase() !== '') {
      this.saveOldReport = this.reportsArray;
      this.reportsArray = this.reportsArray.filter(prod => prod.corretora.toLowerCase().includes(event.target.value.toLowerCase()));
    } else {
      this.reportsArray = this.saveOldReport;
    }

  }


  selectYearStart(yearObj) {

    let monthObj = this.corretoraDates.find(([year, monthObj]) => {
      return year === yearObj
    });

    this.monthsArrayStart = Object.entries(monthObj[1]);

    this.selectedYearStart = yearObj;

  }


  selectYearEnd(yearObj) {

    console.log(this.corretoraDates);

    console.log(yearObj);

    let monthObj = this.corretoraDates.find(([year, monthObj]) => {
      return year === yearObj
    });


    this.monthsArrayEnd = Object.entries(monthObj[1]);

    this.selectedYearEnd = yearObj;

  }

  selectRelatorio(value) {
    this.tipoRelatorio = value;
  }

  gerarRelatorio() {
    this.producaoService.postRelatorioCorretoraAnual(this.selectedYearStart, this.selectedYearEnd, this.activeCorretora).subscribe((data: any) => {

      this.reportsArray = data.report.report;

      console.log(data)

    })
  }

  gerarRelatorioComparativo() {
    this.producaoService.postComparacaoCorretorasAnual(this.selectedYearStart, this.selectedYearEnd, this.activeCorretora).subscribe((data: any) => {
      this.reportsArray = data.report.report;
      this.variacao = data.report.var_media;

      this.variacao = Number((Number(this.variacao) * 100)).toFixed(2);
    })
  }

  setActiveCorretora(corretora) {

    this.reportsArray = [];

    this.corretoraName = '';

    this.corretoraDates = [];

    this.activeCorretora = corretora;

    let findCorretora = this.allCorretoras.find( findCorretora => findCorretora._id === corretora);

    this.corretoraName = findCorretora.name;

    console.log(this.activeCorretora);

    this.producaoService.getCorretoraReports(this.activeCorretora).subscribe((data: any) => {

      this.corretoraName = corretora.name;

      console.log(data);

      if (Object.entries(data.dates).length > 0) {
        this.corretoraDates = Object.entries(data.dates);
        this.selectYearStart(this.corretoraDates[0][0]);
      }

      if (Object.entries(data.dates).length > 0) {
        this.corretoraDates = Object.entries(data.dates);
        this.selectYearEnd(this.corretoraDates[0][0]);

      }

    })

  }

}
