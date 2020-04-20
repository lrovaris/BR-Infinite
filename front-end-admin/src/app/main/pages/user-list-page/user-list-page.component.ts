import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import * as tableData from './data/smart-data-table';

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

  constructor() {
    this.source = new LocalDataSource(tableData.data); // create the source
    this.filterSource = new LocalDataSource(tableData.filerdata); // create the source
    this.alertSource = new LocalDataSource(tableData.alertdata); // create the source
  }
  settings = tableData.settings;
  filtersettings = tableData.filtersettings;
  alertsettings = tableData.alertsettings;

  // And the listener code which asks the DataSource to filter the data:
  onSearch(query: string = '') {
    this.source.setFilter([
      // fields we want to inclue in the search
      {
        field: 'Telefone',
        search: query,
      },
      {
        field: 'Nome',
        search: query,
      },
      {
        field: 'Usuário',
        search: query,
      },
    ], false);
    // second parameter specifying whether to perform 'AND' or 'OR' search
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }

  //  For confirm action On Delete
  onDeleteConfirm(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  //  For confirm action On Save
  onSaveConfirm(event) {
    if (window.confirm('Are you sure you want to save?')) {
      event.newData['name'] += ' + added in code';
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  //  For confirm action On Create
  onCreateConfirm(event) {
    if (window.confirm('Are you sure you want to create?')) {
      event.newData['name'] += ' + added in code';
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  ngOnInit() {
  }

}
