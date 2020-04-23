import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SeguradoraService {

  seguradoraInfo: any;
  url = 'http://localhost:3000';
  telefones = [];
  seguradoras = [];
  resetArray() {
    this.seguradoras = [];
  }

  addArray(nome) {
    this.seguradoras.push(nome);
  }
  removeArray(nome) {
    let index = this.seguradoras.indexOf(nome);
    if (index !== -1) this.seguradoras.splice(index, 1);
  }
  getSeguradoras() {
    return this.seguradoras;
  }

  getAllSeguradoras() {
    return this.http.get(`${this.url}/seguradoras/all`);
  }

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
    let manager = responsavel.value;
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/seguradoras/new`, {seguradora, manager}, options).subscribe((data:any) => {
      alert(data.Message);
    })
  }



}
