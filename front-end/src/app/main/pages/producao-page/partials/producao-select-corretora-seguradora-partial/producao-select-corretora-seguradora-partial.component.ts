import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-producao-select-corretora-seguradora-partial',
  templateUrl: './producao-select-corretora-seguradora-partial.component.html',
  styleUrls: ['./producao-select-corretora-seguradora-partial.component.scss']
})
export class ProducaoSelectCorretoraSeguradoraPartialComponent implements OnInit {

  constructor(private router: Router) { }

  navigateCorretoraSelect() {
    this.router.navigate([''])
  }

  navigateSeguradoraSelect() {
    this.router.navigate(['producao/selecione'])
  }

  navigateEnviarAnexo() {
    this.router.navigate(['producao/enviar'])
  }

  ngOnInit() {
  }

}
