import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CorretoraService {

  seguradoras = [];
  corretoraInfo: any;

  resetArray() {
    this.seguradoras = [];
  }

  addArray(nome) {
    this.seguradoras.push(nome);
  }
  removeArray(nome) {
    let index = this.seguradoras.indexOf(nome);
    if (index !== -1) this.seguradoras.splice(index, 1);
    console.log(this.seguradoras);
  }

  saveCorretoraInfo(corretora) {
    this.corretoraInfo = corretora;
  }
  getCorretoraInfo() {
    return this.corretoraInfo;
  }


  constructor() { }


}
