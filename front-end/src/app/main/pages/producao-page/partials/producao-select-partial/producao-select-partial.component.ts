import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-producao-select-partial',
  templateUrl: './producao-select-partial.component.html',
  styleUrls: ['./producao-select-partial.component.scss']
})
export class ProducaoSelectPartialComponent implements OnInit {

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

  navigateCorretora() {
    this.router.navigate(['producao/selecione/corretora'])
  }

  navigateEnviarAnexo() {
    this.router.navigate(['producao/enviar'])
  }

}
