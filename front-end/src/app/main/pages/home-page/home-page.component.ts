import { Component, OnInit } from '@angular/core';
import {ColaboradorService} from "../../services/colaborador.service";
import {SeguradoraService} from "../../services/seguradora.service";
import {date} from "ng2-validation/dist/date";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  mesSelected: any;

  aniversariantesDoMes = [];

  producaoSeguradoras = [];

  constructor(private colaboradorService: ColaboradorService, private seguradoraService: SeguradoraService) { }

  ngOnInit() {

    this.mesSelected = new Date().getMonth() + 1;

   this.colaboradorService.getBirthDays().subscribe((data: any) => {

      this.aniversariantesDoMes = data;
      this.aniversariantesDoMes = this.aniversariantesDoMes.map(aniversariante => {
      aniversariante.birthday =  this.FormataStringData(aniversariante.birthday);
        return aniversariante;
      })
    });

    this.seguradoraService.getProducaoHomePage().subscribe((data: any) => {
      this.producaoSeguradoras = data.report.report;
      console.log(this.producaoSeguradoras);
    })

  }


  FormataStringData(data) {
    let ano  = data.split("-")[0];
    let mes  = data.split("-")[1];
    let dia  = data.split("-")[2];

    if ((mes) && (dia)) {
      return dia + '/' + (mes)
    }

    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }

  selectNewMonth() {
     setTimeout(()=> {
       this.colaboradorService.getBirthDaysMonth(this.mesSelected).subscribe((data: any) => {
         console.log(data);
         this.aniversariantesDoMes = data;
         this.aniversariantesDoMes = this.aniversariantesDoMes.map(aniversariante => {
           aniversariante.birthday =  this.FormataStringData(aniversariante.birthday);
           return aniversariante;
         })
       })
     })
  }

}
