import { Injectable } from '@angular/core';
import { Colaborador } from "../pages/colaborador-page/Colaborador";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  isResponsible: boolean = false;
  colaborador$ = new Observable<Colaborador>();
  isSeguradora: boolean = false;
  isCorretora: boolean = false;
  localDeTrabalho: string = '';

  ColaboradorResponsavel: Colaborador = {
    name: '',
    telephone: '',
    email: '',
    birthday: '',
    job: '',
    corretora: '',
    seguradora: '',
    active: true
  };

 // TODO ------------------------------ GET SET
  setIsSeguradoraTrue() {
    this.isSeguradora = true;
  }
  setIsCorretoraTrue() {
    this.isCorretora = true;
  }
  setIsSeguradoraFalse() {
    this.isSeguradora = false;
  }
  setIsCorretoraFalse() {
    this.isCorretora = false;
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

  setColaboradorResponsavel(colaborador: Colaborador) {
    this.ColaboradorResponsavel = colaborador;
    console.log(this.ColaboradorResponsavel);
  }

  getColaboradorResponsavel() {
    return this.ColaboradorResponsavel;
  }

  // TODO ------------------------------ END GET SET

  // TODO METODOS DE BACK END ____________________________________________________________________
    cadastro(colaborador) {
    console.log(colaborador);
    }
  // TODO END METODOS DE BACK END ________________________________________________________________
  constructor() { }

}
