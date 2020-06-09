import { Component, OnInit } from '@angular/core';
import {ProducaoService} from "../../../../services/producao.service";
import {CorretoraService} from "../../../../services/corretora.service";

@Component({
  selector: 'app-producao-corretora-diario',
  templateUrl: './producao-corretora-diario.component.html',
  styleUrls: ['./producao-corretora-diario.component.scss']
})
export class ProducaoCorretoraDiarioComponent implements OnInit {

  tipoRelatorio = '';

  reportsArray = [];
  corretoraName = '';
  corretoraDates = [];
  activeCorretora = '';
  allCorretoras = [];

  corretora: any;

  selectedYear: any;
  selectedYearEnd: any;
  selectedMonth: any;
  selectedMonthEnd: any;
  selectedDay: any;
  selectedDayEnd: any;

  firstTime: boolean;
  firstTimeEnd: boolean;

  daysArray = [];
  daysArrayEnd = [];

  monthsArray = [];
  monthsArrayEnd = [];

  media: any;
  acumulado: any;
  projecao: any;

  variacao: any;

  constructor(private producaoService: ProducaoService, private corretoraService: CorretoraService) { }

  ngOnInit() {

    this.firstTime = true;
    this.firstTimeEnd = true;

    this.tipoRelatorio = 'padrao';


    this.corretoraService.getAllCorretoras().subscribe((data:any) => {
      this.allCorretoras = data;
      this.tipoRelatorio = 'comparativo';
      this.setActiveCorretora(this.allCorretoras[0]._id);
      this.tipoRelatorio = 'padrao';
    });

  }

  selectRelatorio(value) {
    this.tipoRelatorio = value;
  }

  setActiveCorretora(corretora) {

    this.reportsArray = [];

    this.corretoraName = '';

    this.corretoraDates = [];


    this.activeCorretora = corretora;

    let findCorretora = this.allCorretoras.find( findCorretora => findCorretora._id === corretora);

    this.corretoraName = findCorretora.name;


    this.producaoService.getCorretoraReports(this.activeCorretora).subscribe((data: any) => {



      this.corretoraName = corretora.name;


      if (Object.entries(data.dates).length > 0) {
        this.corretoraDates = Object.entries(data.dates);
        this.selectYear(this.corretoraDates[0][0]);
        this.selectYearEnd(this.corretoraDates[0][0]);

        setTimeout(() => {
          this.selectMonth(this.monthsArray[0][0]);
          this.selectMonthEnd(this.monthsArray[0][0]);
          setTimeout(() => {
            this.selectDay(this.daysArray[0]);
            this.selectDayEnd(this.daysArrayEnd[0]);
          }, 1)
        }, 1)
      }

    })

  }

  selectYear(yearObj) {
    let monthObj = this.corretoraDates.find(([year, monthObj]) => {
      return year === yearObj
    });
    this.monthsArray = Object.entries(monthObj[1]);
    this.selectedYear = yearObj;
  }

  selectYearEnd(yearObj) {
    let monthObj = this.corretoraDates.find(([year, monthObj]) => {
      return year === yearObj
    });
    this.monthsArrayEnd = Object.entries(monthObj[1]);
    this.selectedYearEnd = yearObj;
  }

  selectMonthEnd(mes) {

    console.log(this.firstTimeEnd);

    this.selectedMonthEnd = mes;

    if (this.tipoRelatorio === 'comparativo') {
      let monthObj = this.corretoraDates.find(([year, monthObj]) => {
        return year === this.selectedYearEnd
      });
      monthObj = Object.entries(monthObj[1]);
      let dayArray = monthObj.find(([mes_, dayArrays]) => {
        return this.selectedMonthEnd === mes_;
      });
      this.daysArrayEnd = dayArray[1];
    } else if ( this.firstTimeEnd ) {

      let monthObj = this.corretoraDates.find(([year, monthObj]) => {
        return year === this.selectedYearEnd
      });
      monthObj = Object.entries(monthObj[1]);
      console.log(monthObj);
      let dayArray = monthObj.find(([mes_, dayArrays]) => {
        return this.selectedMonthEnd === mes_;
      });
      this.daysArrayEnd = dayArray[1];

      this.firstTime = false;
    }
  }

  selectMonth(mes) {
    console.log(mes);
    this.selectedMonth = mes;

    if (this.tipoRelatorio === 'comparativo') {
      let monthObj = this.corretoraDates.find(([year, monthObj]) => {
        return year === this.selectedYear
      });
      monthObj = Object.entries(monthObj[1]);
      let dayArray = monthObj.find(([mes_, dayArrays]) => {
        return this.selectedMonth === mes_;
      });
      this.daysArray = dayArray[1];
    } else if ( this.firstTime) {
      let monthObj = this.corretoraDates.find(([year, monthObj]) => {
        return year === this.selectedYear
      });
      monthObj = Object.entries(monthObj[1]);
      let dayArray = monthObj.find(([mes_, dayArrays]) => {
        return this.selectedMonth === mes_;
      });
      this.daysArray = dayArray[1];
      this.firstTime = false;
    }
  }

  gerarRelatorio() {
    this.producaoService.postRelatorioCorretoraDiario(this.selectedYear, this.selectedMonth, this.activeCorretora).subscribe((data: any) => {

      this.reportsArray = data.report.report;
      this.media = data.report.media;
      this.acumulado = data.report.total;
      this.projecao = data.report.projection;
    })


  }

  gerarRelatorioComparativo() {

    this.producaoService.postComparacaoCorretoraDiaria(this.selectedYear, this.selectedMonth, this.selectedDay,this.selectedYearEnd, this.selectedMonthEnd, this.selectedDayEnd, this.activeCorretora).subscribe((data: any) => {

      this.variacao = data.report.var_media

      this.variacao = Number((Number(this.variacao) * 100)).toFixed(2);

      this.reportsArray = data.report.report;

    })
  }

  selectDay(day) {
    this.selectedDay = day;
  }

  selectDayEnd(day) {
    this.selectedDayEnd = day;
  }

}
