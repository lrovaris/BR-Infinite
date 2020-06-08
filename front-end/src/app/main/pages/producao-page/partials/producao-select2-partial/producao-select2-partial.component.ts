import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-producao-select2-partial',
  templateUrl: './producao-select2-partial.component.html',
  styleUrls: ['./producao-select2-partial.component.scss']
})
export class ProducaoSelect2PartialComponent implements OnInit {


  constructor(private router: Router) { }

  diario = false;
  mensal = false;
  anual = false;

  ngOnInit() {
    this.diario = true;
  }

  changeDiario() {
    this.diario = true;
    this.mensal = false;
    this.anual = false;
  }

  changeMensal() {
    this.diario = false;
    this.mensal = true;
    this.anual = false;
  }

  changeAnual() {
    this.diario = false;
    this.mensal = false;
    this.anual = true;
  }

  navigateSeguradora() {
    this.router.navigate(['producao/selecione/seguradora'])
  }

  navigateEnviarAnexo() {
    this.router.navigate(['producao/enviar'])
  }

}
