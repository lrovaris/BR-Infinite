import { Injectable } from '@angular/core';
import { Colaborador } from "../pages/colaborador-page/Colaborador";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  isResponsible: boolean = false;
  colaborador$ = new Observable<Colaborador>();
  isSeguradora: boolean = false;
  isCorretora: boolean = false;
  localDeTrabalho: string = '';
  colaboradorBackEnd: any;
  name: string = '';

  ColaboradorResponsavel: any;

 // TODO ------------------------------ GET SET
  setIsSeguradoraTrue() {
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
  let corretora = {
      name: this.name,
      isCorretora: this.isCorretora,
    };
    return corretora;
  }

  getIsSeguradora() {
    return this.isSeguradora;
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

  setColaboradorResponsavel(colaborador, newColaborador) {
    this.colaboradorBackEnd = newColaborador;
    this.ColaboradorResponsavel = colaborador;
    this.router.navigate(['corretora']);
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
  constructor(private router: Router) { }

}
