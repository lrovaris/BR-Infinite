import { Component, OnInit } from '@angular/core';
import {SeguradoraService} from "../../services/seguradora.service";
import {Router} from "@angular/router";
import {ProducaoService} from "../../services/producao.service";

@Component({
  selector: 'app-producao-page',
  templateUrl: './producao-page.component.html',
  styleUrls: ['./producao-page.component.scss']
})
export class ProducaoPageComponent implements OnInit {

  allSeguradoras = [];
  allProducoes = [];

  constructor(private seguradoraService: SeguradoraService, private router: Router, private producaoService: ProducaoService) { }

  navigateEnviarAnexo() {
    this.router.navigate(['producao/enviar']);
  }

  ngOnInit() {
    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.allSeguradoras = data;
    });

    this.producaoService.getAllProducao().subscribe((data: any) => {
      this.allProducoes = data;
      console.log(data);
    })

  }

}
