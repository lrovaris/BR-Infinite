import { Component, OnInit } from '@angular/core';
import {SeguradoraService} from "../../../../services/seguradora.service";
import {Router} from "@angular/router";
import {ProducaoService} from "../../../../services/producao.service";
import {CorretoraService} from "../../../../services/corretora.service";
import {DateService} from "../../../../services/utils/date.service";

@Component({
  selector: 'app-producao-mensal-partial',
  templateUrl: './producao-mensal-partial.component.html',
  styleUrls: ['./producao-mensal-partial.component.scss']
})
export class ProducaoMensalPartialComponent implements OnInit {

  reportsArray = [];
  saveOldReport = [];

  tipoRelatorio = 'Padrão';
  seguradoraName = 'Seguradora';
  selectedMonthStart = '';
  selectedYearStart = '';
  selectedMonthEnd = '';
  selectedYearEnd = '';

  variacao: any;

  corretoraFilter = '';
  allSeguradoras = [];

  seguradoraDates = [];

  seguradora = [];

  corretora = [];

  activeSeguradora = '';

  allProducoes = [];

  monthsArrayStart = [];
  monthsArrayEnd = [];

  selectedMonth: any;
  selectedYear: any;

  monthsArray = [];

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
      this.setActiveSeguradora(this.allSeguradoras[0]._id);
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

    console.log(event.target.value.toLowerCase());

    if(event.target.value.toLowerCase() !== '') {
      this.saveOldReport = this.reportsArray;
      this.reportsArray = this.reportsArray.filter(prod => prod.corretora.toLowerCase().includes(event.target.value.toLowerCase()));
    } else {
      this.reportsArray = this.saveOldReport;
    }

  }

  selectMonthStart(mes) {
    this.selectedMonthStart = mes;
  }

  selectYearStart(yearObj) {

    let monthObj = this.seguradoraDates.find(([year, monthObj]) => {
      return year === yearObj
    });

    this.monthsArrayStart = Object.entries(monthObj[1]);

    this.selectedYearStart = yearObj;

  }

  selectMonthEnd(mes) {
    this.selectedMonthEnd = mes;
  }

  selectYearEnd(yearObj) {

    console.log(this.seguradoraDates);

    console.log(yearObj);

    let monthObj = this.seguradoraDates.find(([year, monthObj]) => {
     return year === yearObj
    });


    this.monthsArrayEnd = Object.entries(monthObj[1]);

    this.selectedYearEnd = yearObj;

  }

  selectRelatorio(value) {
    this.tipoRelatorio = value;
  }

  gerarRelatorio() {
    this.producaoService.postRelatorioMensal(this.selectedYearStart, this.selectedMonthStart, this.selectedYearEnd, this.selectedMonthEnd, this.activeSeguradora).subscribe((data: any) => {
      console.log(data);
      this.reportsArray = data.report.report;
      console.log(this.reportsArray);
    })
  }

  gerarRelatorioComparativo() {
    this.producaoService.postComparacaoMensal(this.selectedYearStart, this.selectedMonthStart, this.selectedYearEnd, this.selectedMonthEnd, this.activeSeguradora).subscribe((data: any) => {
      console.log(data);
      this.reportsArray = data.report.report;
      this.variacao = data.report.var_media;

      this.variacao = Number((Number(this.variacao) * 100)).toFixed(2);
    })
  }

  setActiveSeguradora(seguradora) {

    this.reportsArray = [];

    this.seguradoraName = '';

    this.seguradoraDates = [];

    this.activeSeguradora = seguradora;

    let findSeguradora = this.allSeguradoras.find( findSeguradora => findSeguradora._id === seguradora);

    this.seguradoraName = findSeguradora.name;

    console.log(this.activeSeguradora);

    this.producaoService.getSeguradoraReports(this.activeSeguradora).subscribe((data: any) => {

      this.seguradoraName = seguradora.name;

      console.log(data);

      if (Object.entries(data.dates).length > 0) {
        this.seguradoraDates = Object.entries(data.dates);
        this.selectYearStart(this.seguradoraDates[0][0]);
        setTimeout(() => {
          this.selectMonthStart(this.monthsArrayStart[0][0]);
        }, 1)
      }

      if (Object.entries(data.dates).length > 0) {
        this.seguradoraDates = Object.entries(data.dates);
        this.selectYearEnd(this.seguradoraDates[0][0]);
        setTimeout(() => {
          this.selectMonthEnd(this.monthsArrayEnd[0][0]);
        }, 1)
      }

    })

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

}
