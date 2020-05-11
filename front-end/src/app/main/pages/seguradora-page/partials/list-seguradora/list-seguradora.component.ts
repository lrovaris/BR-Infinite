import { Component, OnInit } from '@angular/core';
import {SeguradoraService} from "../../../../services/seguradora.service";
import {Router} from "@angular/router";
import * as tableData from "./data/smart-data-table";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-list-seguradora',
  templateUrl: './list-seguradora.component.html',
  styleUrls: ['./list-seguradora.component.scss']
})
export class ListSeguradoraComponent implements OnInit {

  seguradoras: any;
  seguradorasObject: any;
  seguradorasFormatada: any;

  constructor(private seguradoraService: SeguradoraService, private router: Router) {

  }
  settings = tableData.settings;
  filtersettings = tableData.filtersettings;
  alertsettings = tableData.alertsettings;

  navigateCadastroSeguradora() {
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
}
