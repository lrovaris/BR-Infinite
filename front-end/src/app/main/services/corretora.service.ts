import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CorretoraService {

  url = 'http://localhost:3000';

  seguradoras = [];
  corretoraInfo: any;
  responsavel: any;

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
  getSeguradoras() {
    return this.seguradoras;
  }
  postCorretora(corretora, responsavel){
    console.log(corretora);
    console.log(responsavel.value);
    let manager = responsavel.value;
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/corretoras/new`, {corretora, manager}, options).subscribe(data => {
      console.log(data);
    })
  }


  constructor(private http: HttpClient) { }


}
