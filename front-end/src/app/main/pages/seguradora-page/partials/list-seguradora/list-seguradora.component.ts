import { Component, OnInit } from '@angular/core';
import {SeguradoraService} from "../../../../services/seguradora.service";
import {Router} from "@angular/router";
import * as tableData from "./data/smart-data-table";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ColaboradorService} from "../../../../services/colaborador.service";
import {CorretoraService} from "../../../../services/corretora.service";

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-list-seguradora',
  templateUrl: './list-seguradora.component.html',
  styleUrls: ['./list-seguradora.component.scss']
})
export class ListSeguradoraComponent implements OnInit {

  seguradoras: any;
  seguradorasObject: any;
  seguradorasFormatada: any;

  constructor(private seguradoraService: SeguradoraService,
              private router: Router,
              private colaboradorService: ColaboradorService,
              private corretoraService: CorretoraService) {

  }
  settings = tableData.settings;
  filtersettings = tableData.filtersettings;
  alertsettings = tableData.alertsettings;

  navigateCadastroSeguradora() {
    this.corretoraService.setCorretoraInfoWithOutFormGroupNull();
    this.colaboradorService.setColaboradorResponsavelNull();
    this.seguradoraService.setseguradoraInfoWithOutFormGroupNull();
    this.router.navigate(['seguradora/cadastro'])
  }

  log(event){
    console.log(event.data);
  }



  viewSeguradora(id) {
    this.seguradoraService.getSeguradora(id).subscribe((data: any) => {
      this.seguradoraService.viewSeguradora(data);
    })
  }

  ngOnInit() {
    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.seguradoras = data;
    });
  }

  downloadCsv() {
    this.seguradoraService.downloadAllCsv().subscribe((data: any) => {
      saveAs(data, 'seguradoras-report.csv');
    })
  }

}
