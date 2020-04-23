import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SeguradoraService {

  seguradoraInfo: any;
  url = 'http://localhost:3000';
  telefones = [];

  constructor(private http: HttpClient) { }

  setTelefones(telefones) {
    this.telefones = telefones;
  }
  getTelefones() {
    return this.telefones;
  }

  saveSeguradoraInfo(seguradora) {
    this.seguradoraInfo = seguradora;
  }
  getSeguradoraInfo() {
    return this.seguradoraInfo;
  }

  postSeguradora(seguradora, responsavel){
    console.log(seguradora);
    console.log(responsavel.value);
    let manager = responsavel.value;
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/seguradoras/new`, {seguradora, manager}, options).subscribe(data => {
      console.log(data);
    })
  }

}
