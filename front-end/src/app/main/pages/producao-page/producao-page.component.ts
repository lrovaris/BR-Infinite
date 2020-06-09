import { Component, OnInit } from '@angular/core';
import { SeguradoraService} from "../../services/seguradora.service";
import { Router} from "@angular/router";
import { ProducaoService} from "../../services/producao.service";
import { CorretoraService} from "../../services/corretora.service";
import { DateService} from "../../services/utils/date.service";

import { barChartSingle, barChartmulti, pieChartSingle, pieChartmulti, lineChartSingle, lineChartMulti, areaChartSingle, areaChartMulti } from '../../../shared/data/ngxChart';
import * as chartsData from '../../../shared/configs/ngx-charts.config';


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

  media = '';
  acumulado = '';
  projecao = '';
  variacao = '';

  tipoRelatorio = '';

  reportsArray = [];
  seguradoraDates = [];
  saveOldReport = [];

  monthsArray = [];
  daysArray = [];

  monthsArrayEnd = [];
  daysArrayEnd = [];

  selectedYear: any;
  selectedMonth: any;
  selectedDay: any;
  selectedYearEnd: any;
  selectedMonthEnd: any;
  selectedDayEnd: any;

  activeSeguradora: any;
  seguradoraName: any;

  corretoraFilter = "";

  constructor(
              private seguradoraService: SeguradoraService,
              private router: Router,
              private producaoService: ProducaoService,
              private corretoraService: CorretoraService,
              private dateService: DateService
  ) { }


  ngOnInit() {

    this.tipoRelatorio = 'padrao';

    this.corretoraFilter = "";

    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.allSeguradoras = data;
      this.tipoRelatorio = 'comparativo';
      this.setActiveSeguradora(this.allSeguradoras[0]._id);
      this.tipoRelatorio = 'padrao';
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


    if(event.target.value.toLowerCase() !== '') {
      this.saveOldReport = this.reportsArray;
      this.reportsArray = this.reportsArray.filter(prod => prod.corretora.toLowerCase().includes(event.target.value.toLowerCase()));
    } else {
      this.reportsArray = this.saveOldReport;
    }

  }

  gerarRelatorio() {
    this.producaoService.postRelatorioDiario(this.selectedYear, this.selectedMonth, this.activeSeguradora).subscribe((data: any) => {

      this.reportsArray = data.report.report;
      this.media = data.report.media;
      this.acumulado = data.report.total;
      this.projecao = data.report.projection;
    })
  }

  gerarRelatorioComparativo() {
    console.log(this.selectedMonthEnd);
    this.producaoService.postComparacaoDiaria(this.selectedYear, this.selectedMonth, this.selectedDay,this.selectedYearEnd, this.selectedMonthEnd, this.selectedDayEnd, this.activeSeguradora).subscribe((data: any) => {
      console.log(data);

      this.variacao = data.report.var_media

      this.variacao = Number((Number(this.variacao) * 100)).toFixed(2);

      this.reportsArray = data.report.report;

    })
  }

  selectDay(day) {
    this.selectedDay = day;
  }

  selectMonth(mes) {
    console.log(mes);
    this.selectedMonth = mes;

    if (this.tipoRelatorio === 'comparativo') {
      let monthObj = this.seguradoraDates.find(([year, monthObj]) => {
        return year === this.selectedYear
      });
      monthObj = Object.entries(monthObj[1]);
      let dayArray = monthObj.find(([mes_, dayArrays]) => {
        return this.selectedMonth === mes_;
      });
      this.daysArray = dayArray[1];
    }
  }

  selectYear(yearObj) {
    let monthObj = this.seguradoraDates.find(([year, monthObj]) => {
      return year === yearObj
    });
    this.monthsArray = Object.entries(monthObj[1]);
    this.selectedYear = yearObj;
  }


  selectDayEnd(day) {
    this.selectedDayEnd = day;
  }

  selectMonthEnd(mes) {
    this.selectedMonthEnd = mes;

    if (this.tipoRelatorio === 'comparativo') {
      let monthObj = this.seguradoraDates.find(([year, monthObj]) => {
        return year === this.selectedYearEnd
      });
      monthObj = Object.entries(monthObj[1]);
      let dayArray = monthObj.find(([mes_, dayArrays]) => {
        return this.selectedMonthEnd === mes_;
      });
      this.daysArrayEnd = dayArray[1];
    }
  }

  selectYearEnd(yearObj) {
    let monthObj = this.seguradoraDates.find(([year, monthObj]) => {
      return year === yearObj
    });
    this.monthsArrayEnd = Object.entries(monthObj[1]);
    this.selectedYearEnd = yearObj;
  }


  selectRelatorio(value) {
    this.tipoRelatorio = value;
  }


  setActiveSeguradora(seguradora) {

  this.reportsArray = [];

    this.seguradoraName = '';

    this.seguradoraDates = [];


    this.activeSeguradora = seguradora;

    let findSeguradora = this.allSeguradoras.find( findSeguradora => findSeguradora._id === seguradora);

    this.seguradoraName = findSeguradora.name;


    this.producaoService.getSeguradoraReports(this.activeSeguradora).subscribe((data: any) => {

      this.seguradoraName = seguradora.name;


      if (Object.entries(data.dates).length > 0) {
        this.seguradoraDates = Object.entries(data.dates);
        this.selectYear(this.seguradoraDates[0][0]);
        console.log(this.monthsArray);
        setTimeout(() => {
          this.selectMonth(this.monthsArray[0][0]);
        }, 1)
      }

    })

  }


  /*
  TODO corretora: {name: "Corretora corretora", _id: "5ec820471b5b4a1ff5feb995", telephone: "", email: ""}
  TODO date: "14/05/2020"
  TODO seguradora: {name: "teste abcd", _id: "5ec7dfcf1b5b4a1ff5feb991", telephone: null, email: null}
  TODO sentDate: "2020-05-22T18:58:35.649Z"
  TODO total: 1200
  TODO _id: "5ec820db1b5b4a1ff5feb999"
  */



}
