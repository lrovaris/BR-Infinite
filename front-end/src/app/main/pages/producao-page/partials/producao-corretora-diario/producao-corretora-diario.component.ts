import { Component, OnInit } from '@angular/core';
import {ProducaoService} from "../../../../services/producao.service";
import {CorretoraService} from "../../../../services/corretora.service";
import {OrdenaListService} from "../../../../services/utils/ordena-list.service";

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

  saveOldReport: any;

  constructor(private producaoService: ProducaoService, private corretoraService: CorretoraService, private ordena: OrdenaListService) { }

  ngOnInit() {

    this.firstTime = true;
    this.firstTimeEnd = true;

    this.tipoRelatorio = 'Padrão';


    this.corretoraService.getAllCorretoras().subscribe((data:any) => {
      this.allCorretoras = data;
      this.tipoRelatorio = 'Comparativo';
      this.setActiveCorretora(this.allCorretoras[0]._id);
      this.tipoRelatorio = 'Padrão';
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

    if (this.tipoRelatorio === 'Comparativo') {
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

    if (this.tipoRelatorio === 'Comparativo') {
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
      this.ordena.ordenarAlfabetico(this.reportsArray, 'seguradora');
      this.media = data.report.media;
      this.acumulado = data.report.total;
      this.projecao = data.report.projection;
      this.ordena.ordenarAlfabetico(this.reportsArray, 'seguradora');
      this.saveOldReport = this.reportsArray;
    })


  }

  gerarRelatorioComparativo() {

    this.producaoService.postComparacaoCorretoraDiaria(this.selectedYear, this.selectedMonth, this.selectedDay,this.selectedYearEnd, this.selectedMonthEnd, this.selectedDayEnd, this.activeCorretora).subscribe((data: any) => {

      this.variacao = data.report.var_media

      this.variacao = Number((Number(this.variacao) * 100)).toFixed(2);

      this.reportsArray = data.report.report;

      this.ordena.ordenarAlfabetico(this.reportsArray, 'seguradora');

      this.ordena.ordenarAlfabetico(this.reportsArray, 'seguradora');

      this.saveOldReport = this.reportsArray;



    })
  }

  selectDay(day) {
    this.selectedDay = day;
  }

  selectDayEnd(day) {
    this.selectedDayEnd = day;
  }

  formatMoney(amount, decimalCount = 2, decimal = ",", thousands = ".") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      // @ts-ignore
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  };

  filterCorretoras(event){

    console.log(event.target.value.toLowerCase());

    if(event.target.value.toLowerCase() !== '') {
      this.ordena.ordenarAlfabetico(this.reportsArray, 'seguradora');
      this.reportsArray = this.reportsArray.filter(prod => prod.seguradora.toLowerCase().includes(event.target.value.toLowerCase()));
      this.ordena.ordenarAlfabetico(this.reportsArray, 'seguradora');
    } else {
      this.ordena.ordenarAlfabetico(this.reportsArray, 'seguradora');
      this.reportsArray = this.saveOldReport;
    }

  }

}
