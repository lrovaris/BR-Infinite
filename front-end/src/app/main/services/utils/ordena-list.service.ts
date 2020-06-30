import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdenaListService {

  constructor() { }


  ordenarAlfabetico(array, propriedade) {

    array.sort(function (a,b) {
      return a[propriedade].toLowerCase() < b[propriedade].toLowerCase() ? -1 : a[propriedade].toLowerCase() > b[propriedade].toLowerCase() ? 1 : 0;
    })
  }


}
