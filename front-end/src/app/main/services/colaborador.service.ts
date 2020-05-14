import {Injectable} from '@angular/core';
import {Colaborador} from "../pages/colaborador-page/Colaborador";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  workId: any;
  isResponsible: boolean = false;
  colaborador$ = new Observable<Colaborador>();
  isSeguradora: boolean = false;
  isCorretora: boolean = false;
  localDeTrabalho: string = '';
  colaboradorBackEnd: any;
  name: string = '';
  url = 'http://162.214.89.17:3000'; // 162.214.89.17:3000/

  checkCameFromSeguradoraList = false;
  checkCameFromCorretoraList = false;

  ColaboradorResponsavel: any;



 // TODO ------------------------------ GET SET

  setCameFromCorretoraTrue() {
    this.checkCameFromCorretoraList = true;
  }
  getCameFromCorretora() {
   return this.checkCameFromCorretoraList;
  }
  setCameFromSeguradoraTrue() {
    this.checkCameFromSeguradoraList = true;
  }
  getCameFromSeguradora() {
    return this.checkCameFromSeguradoraList;
  }

  setWorkId(id) {
    this.workId = id;
  }
  setIsSeguradoraTrue(name) {
    this.name = name;
    this.isSeguradora = true;
  }
  setIsCorretoraTrue(name) {
    this.name = name;
    this.isCorretora = true;
  }
  setIsSeguradoraFalse() {
    this.isSeguradora = false;
  }
  setIsCorretoraFalse() {
    this.isCorretora = false;
  }

  getIsCorretora() {
    return {
      name: this.name,
      isCorretora: this.isCorretora,
    };
  }

  getIsSeguradora() {
    return {
      name: this.name,
      isSeguradora: this.isSeguradora,
    };
  }

  setColaboradorResponsavelNull() {
    this.ColaboradorResponsavel = null;
  }

  getColaboradorBackEnd() {
    return this.colaboradorBackEnd;
  }

  setIsResponsibleFalse() {
    this.isResponsible = false;
  }
  setIsResponsibleTrue() {
    this.isResponsible = true;
  }
  getIsResponsible() {
    return this.isResponsible;
  }

  desactiveColaborador(id){
    this.http.post(`${this.url}/colaboradores/${id}/delete`, {}).subscribe((data: any) => {
      alert(data.message)
    })
  }

  setColaboradorResponsavel(colaborador, newColaborador) {
    this.colaboradorBackEnd = newColaborador;
    this.ColaboradorResponsavel = colaborador;
  }

  getColaboradorResponsavel() {
    return this.ColaboradorResponsavel;
  }

  // TODO ------------------------------ END GET SET

  // TODO METODOS DE BACK END ____________________________________________________________________
    getColaborador(id) {
    return this.http.get(`${this.url}/colaboradores/${id}`)
    }
  // TODO END METODOS DE BACK END ________________________________________________________________
  constructor(private router: Router, private http: HttpClient) { }

  postColaborador(colaborador) {
    return this.http.post(`${this.url}/colaboradores/new`, colaborador)
  }

}
