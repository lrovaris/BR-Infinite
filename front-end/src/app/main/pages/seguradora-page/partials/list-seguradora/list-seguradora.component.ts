import { Component, OnInit } from '@angular/core';
import {SeguradoraService} from "../../../../services/seguradora.service";
import {Router} from "@angular/router";
import * as tableData from "./data/smart-data-table";
import {LocalDataSource} from "ng2-smart-table";

@Component({
  selector: 'app-list-seguradora',
  templateUrl: './list-seguradora.component.html',
  styleUrls: ['./list-seguradora.component.scss']
})
export class ListSeguradoraComponent implements OnInit {

  seguradoras: any;
  source: LocalDataSource;
  filterSource: LocalDataSource;
  alertSource: LocalDataSource;
  seguradorasObject: any;
  seguradorasFormatada: any;

  constructor(private seguradoraService: SeguradoraService, private router: Router) {
    this.source = new LocalDataSource(tableData.data); // create the source
    this.filterSource = new LocalDataSource(tableData.filerdata); // create the source
    this.alertSource = new LocalDataSource(tableData.alertdata); // create the source
  }
  settings = tableData.settings;
  filtersettings = tableData.filtersettings;
  alertsettings = tableData.alertsettings;

  navigateCadastroSeguradora() {
    this.router.navigate(['seguradora/cadastro'])
  }

  log(event){
    console.log(event.data);
  }

  //  For confirm action On Delete
  onDeleteConfirm(event) {
   /* if (window.confirm('Tem certeza que deseja deletar?')) {
      console.log(event);
      let data = event.data;
      data.active = false;
      this.loginService.updateCadastro(data);
      this.loginService.getUsers().subscribe(() => {
        this.loginService.getUsers();
        event.confirm.resolve();
      });

    } else {
      event.confirm.reject();
    }*/
  }

  //  For confirm action On Save
  onSaveConfirm(event) {
    /*if (window.confirm('Tem certeza que deseja salvar?')) {
      this.loginService.updateCadastro(event.newData);
      this.loginService.getUsers().subscribe(() => {
        this.loginService.getUsers();
        event.confirm.resolve();
      });

    } else {
      event.confirm.reject();
    }*/
  }


  ngOnInit() {
    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.seguradoras = data;
      this.seguradorasFormatada = [];
      for (let i = 0; i < this.seguradoras.length; i++) {
        this.seguradorasFormatada.push({
          name: this.seguradoras[i].name,
          telephone: this.seguradoras[i].telephone,
          managerName: this.seguradoras[i].manager.telephone,
          managerEmail: this.seguradoras[i].manager.email,
        })
      }
      this.filterSource = this.seguradoras;
      this.source = this.seguradoras;
      this.alertSource = this.seguradoras;
    });
  }

}
