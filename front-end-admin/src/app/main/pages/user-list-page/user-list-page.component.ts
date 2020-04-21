import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import * as tableData from './data/smart-data-table';
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-user-list-page',
  templateUrl: './user-list-page.component.html',
  styleUrls: ['./user-list-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListPageComponent implements OnInit {

  source: LocalDataSource;
  filterSource: LocalDataSource;
  alertSource: LocalDataSource;
  users: any;

  constructor(public loginService: LoginService) {
    this.source = new LocalDataSource(tableData.data); // create the source
    this.filterSource = new LocalDataSource(tableData.filerdata); // create the source
    this.alertSource = new LocalDataSource(tableData.alertdata); // create the source
  }
  settings = tableData.settings;
  filtersettings = tableData.filtersettings;
  alertsettings = tableData.alertsettings;



  log(event){
    console.log(event.data);
  }

  //  For confirm action On Delete
  onDeleteConfirm(event) {
    if (window.confirm('Tem certeza que deseja deletar?')) {
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
    }
  }

  //  For confirm action On Save
  onSaveConfirm(event) {
    if (window.confirm('Tem certeza que deseja salvar?')) {
      this.loginService.updateCadastro(event.newData);
      this.loginService.getUsers().subscribe(() => {
        this.loginService.getUsers();
        event.confirm.resolve();
      });

    } else {
      event.confirm.reject();
    }
  }


  ngOnInit() {
    this.loginService.getUsers().subscribe((data: any) => {
      this.users = data;
      console.log(this.users);
      this.filterSource = this.users;
      this.source = this.users;
      this.alertSource = this.users;
    })
  }

}
