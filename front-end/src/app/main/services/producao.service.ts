import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UrlService} from "./utils/url.service";

@Injectable({
  providedIn: 'root'
})
export class ProducaoService {

  url = 'http://162.214.89.17:3000'; // 162.214.89.17:3000/

  constructor(private http: HttpClient, private urlService: UrlService) { }

  enviarAnexo(file) {
    return this.http.post(`${this.url}/production/upload`, file);
  }

  postProducao(producao) {
    return this.http.post(`${this.url}/production/new`, producao);
  }

  getAllProducao() {
    return this.http.get(`${this.urlService.getUrl()}/production/all`);
  }

  getSeguradoraReports(id) {
    return this.http.get(`${this.urlService.getUrl()}/production/seguradoras/${id}`)
  }

  postRelatorioDiario(year, month, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/seguradoras/${id}/report/daily`, {year,month})
  }

  postRelatorioMensal(beginYear, beginMonth,endYear,endMonth, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/seguradoras/${id}/report/monthly`, {beginYear, beginMonth, endYear, endMonth})
  }

  postRelatorioAnual(beginYear,endYear, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/seguradoras/${id}/report/yearly`, {beginYear, endYear})
  }

}
