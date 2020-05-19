import { Component, OnInit } from '@angular/core';
import {SeguradoraService} from "../../services/seguradora.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-producao-page',
  templateUrl: './producao-page.component.html',
  styleUrls: ['./producao-page.component.scss']
})
export class ProducaoPageComponent implements OnInit {

  allSeguradoras = [];

  constructor(private seguradoraService: SeguradoraService, private router: Router) { }

  navigateEnviarAnexo() {
    this.router.navigate(['producao/enviar']);
  }

  ngOnInit() {
    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.allSeguradoras = data;
    });
  }

}
