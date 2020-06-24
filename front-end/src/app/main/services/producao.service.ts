import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UrlService} from "./utils/url.service";

@Injectable({
  providedIn: 'root'
})
export class ProducaoService {

  constructor(private http: HttpClient, private urlService: UrlService) { }

  url = this.urlService.getUrl();

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

  getCorretoraReports(id) {
    return this.http.get(`${this.urlService.getUrl()}/production/corretoras/${id}`)
  }

  postRelatorioDiario(year, month, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/seguradoras/${id}/report/daily`, {year,month})
  }

  postRelatorioCorretoraDiario(year, month, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/corretoras/${id}/report/daily`, {year,month})
  }

  postRelatorioMensal(beginYear, beginMonth,endYear,endMonth, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/seguradoras/${id}/report/monthly`, {beginYear, beginMonth, endYear, endMonth})
  }

  postRelatorioCorretoraMensal(beginYear, beginMonth,endYear,endMonth, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/corretoras/${id}/report/monthly`, {beginYear, beginMonth, endYear, endMonth})
  }

  postRelatorioAnual(beginYear,endYear, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/seguradoras/${id}/report/yearly`, {beginYear, endYear})
  }

  postRelatorioCorretoraAnual(beginYear,endYear, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/corretoras/${id}/report/yearly`, {beginYear, endYear})
  }

  postComparacaoDiaria(firstYear, firstMonth,firstDay, secondYear,secondMonth,secondDay, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/seguradoras/${id}/compare/daily`, {firstYear, firstMonth, firstDay, secondYear,secondMonth,secondDay,})
  }

  postComparacaoCorretoraDiaria(firstYear, firstMonth,firstDay, secondYear,secondMonth,secondDay, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/corretoras/${id}/compare/daily`, {firstYear, firstMonth, firstDay, secondYear,secondMonth,secondDay,})
  }

  postComparacaoMensal(firstYear, firstMonth, secondYear,secondMonth, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/seguradoras/${id}/compare/monthly`, {firstYear, firstMonth, secondYear,secondMonth,})
  }

  postComparacaoCorretoraMensal(firstYear, firstMonth, secondYear,secondMonth, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/corretoras/${id}/compare/monthly`, {firstYear, firstMonth, secondYear,secondMonth,})
  }

  postComparacaoAnual(firstYear, secondYear, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/seguradoras/${id}/compare/yearly`, {firstYear, secondYear,})
  }

  postComparacaoCorretorasAnual(firstYear, secondYear, id) {
    return this.http.post(`${this.urlService.getUrl()}/production/corretoras/${id}/compare/yearly`, {firstYear, secondYear,})
  }

}
