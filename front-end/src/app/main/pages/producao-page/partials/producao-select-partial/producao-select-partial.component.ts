import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-producao-select-partial',
  templateUrl: './producao-select-partial.component.html',
  styleUrls: ['./producao-select-partial.component.scss']
})
export class ProducaoSelectPartialComponent implements OnInit {

  constructor(private router: Router) { }

  navigateDiario() {
    this.router.navigate(['producao/diario'])
  }

  navigateMensal() {
    this.router.navigate(['producao/mensal'])
  }

  ngOnInit() {
  }

}
