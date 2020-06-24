import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CorretoraService {

  url = 'http://162.214.89.17:3000'; // 162.214.89.17:3000/

  corretoraInfo: any;
  corretoraInfoWithOutFormGroup: any;

  getCorretoraInfo() {
    return this.corretoraInfo;
  }

  setCorretoraInfoWithOutFormGroupNull() {
    this.corretoraInfoWithOutFormGroup = null
  }

  setCorretoraInfoWithOutFormGroup(data) {
    this.corretoraInfoWithOutFormGroup = data
  }

  getcorretoraInfoWithOutFormGroup() {
    return this.corretoraInfoWithOutFormGroup;
  }

  getCorretoraId(){
    return this.corretoraInfoWithOutFormGroup._id;
  }

  postUpload(file) {
    return this.http.post(`${this.url}/corretoras/upload`, file);
  }

  downloadFile(path) {
    return this.http.post(`${this.url}/corretoras/download`, {path: path}, {responseType: 'blob'});
  }


  postCorretora(corretora, responsavel){
    if (!responsavel) {
      alert('Você não pode cadastrar uma corretora sem um corretor Responsável');
      return
    }
    let manager = responsavel;
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/corretoras/new`, {corretora, manager}, options)
  }

  editPostCorretora(id, corretora){
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };

    return this.http.post(`${this.url}/corretoras/${id}/edit`, corretora, options);
  }

  getAllCorretoras() {
    return this.http.get(`${this.url}/corretoras/all`);
  }

  getCorretora(id) {
    return this.http.get(`${this.url}/corretoras/${id}`)
  }

  navigateToViewCorretora(corretora) {
    console.log('chegou aqui!');

    this.corretoraInfoWithOutFormGroup = corretora;
    this.router.navigate(['corretora/visualizacao'])
  }

  downloadCsv(id){
    return this.http.get(`${this.url}/corretoras/${id}/csv`, {responseType: 'blob'})
  }

  downloadAllCsv() {
    return this.http.get(`${this.url}/corretoras/all/csv`, {responseType: 'blob'})
  }

  filterCorretoraList(filters) {

    return this.http.post(`${this.url}/corretoras/filter`, {filters})

  }

  constructor(private http: HttpClient, private router: Router) { }


}
