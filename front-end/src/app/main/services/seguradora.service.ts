import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SeguradoraService {

  seguradoraInfo: any;
  url = 'http://162.214.89.17:3000'; // 162.214.89.17:3000
  telefones = [];
  seguradoras = [];
  seguradoraInfoWithOutFormGroup: any;

  isEdit = false;

  constructor(private http: HttpClient, private router: Router) { }

  getIsEdit() {
    return this.isEdit;
  }

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
  getseguradoraInfoWithOutFormGroup() {
    return this.seguradoraInfoWithOutFormGroup;
  }
  editSeguradora(seguradora) {
    this.seguradoraInfoWithOutFormGroup = seguradora;
    this.isEdit = true;
    this.router.navigate(['seguradora/visualizacao'])
  }



  getSeguradora(id) {
    return this.http.get(`${this.url}/seguradoras/${id}`)
  }

  getAllSeguradoras() {
    return this.http.get(`${this.url}/seguradoras/all`);
  }


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

  editPostSeguradora(id, seguradora, responsavel){
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/seguradoras/${id}/edit`, seguradora, options).subscribe((data:any) => {
      alert(data.Message);
      this.isEdit = false;
     this.getSeguradora(id).subscribe((data: any) => {
       this.seguradoraInfoWithOutFormGroup = data;
       this.router.navigate(['seguradora/visualizacao'])
     });
    })
  }


}
