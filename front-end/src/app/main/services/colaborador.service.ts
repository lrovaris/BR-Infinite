import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlService} from "./utils/url.service";

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  hasColaboradorChanged = false;

  ColaboradorResponsavel: any;

  constructor(private router: Router, private http: HttpClient, private urlService: UrlService) { }

  getHasColaboradorChanged() {
    return this.hasColaboradorChanged;
  }

  setHasColaboradorChanged(boolean: boolean) {
    this.hasColaboradorChanged = boolean;
  }


  getColaboradorResponsavel() {
    return this.ColaboradorResponsavel;
  }

  setColaboradorResponsavelNull() {
    this.ColaboradorResponsavel = null;
  }

  setColaboradorResponsavel(colaborador) {
    this.ColaboradorResponsavel = colaborador;
  }

    getColaborador(id) {
    return this.http.get(`${this.urlService.getUrl()}/colaboradores/${id}`)
    }

  addNewColaborador(colaborador) {
    return this.http.post(`${this.urlService.getUrl()}/colaboradores/new`, colaborador)
  }

  desactiveColaborador(id){
    this.http.post(`${this.urlService.getUrl()}/colaboradores/${id}/delete`, {}).subscribe((data: any) => {
      alert(data.message)
    })
  }

  editColaborador(id, changes){
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
   return this.http.post(`${this.urlService.getUrl()}/colaboradores/${id}/edit`, changes, options);
  }

  getBirthDays() {
    return this.http.get(`${this.urlService.getUrl()}/colaboradores/birthday`);
  }

  getBirthDaysMonth(montha) {
    let x = Number(montha);
    console.log(x);
    return this.http.post(`${this.urlService.getUrl()}/colaboradores/birthday`, {month: x});
  }

}
