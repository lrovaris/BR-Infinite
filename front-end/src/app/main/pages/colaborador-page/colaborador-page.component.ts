import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ColaboradorService} from "../../services/colaborador.service";
import {Colaborador} from "./Colaborador";

@Component({
  selector: 'app-colaborador-page',
  templateUrl: './colaborador-page.component.html',
  styleUrls: ['./colaborador-page.component.scss']
})
export class ColaboradorPageComponent implements OnInit {

  selectIndex: number = 0;
  selectTriggered: boolean = false;
  checkSelect: boolean = null;
  checkIsResonponsible: boolean = false;

  submitted = false;
  colaborador: FormGroup;

  name: string = '';


  onSelectTrabalho(index) {
    this.selectTriggered = true;
    if (index === 'seguradora') {
      this.checkSelect = false;
      return
    } else if (index === 'corretora') {
      this.checkSelect = true;
      return
    } else {
      return
    }
  }


  constructor(private formbuilder: FormBuilder, public colaboradorService: ColaboradorService, private router: Router) {
    this.colaborador = this.formbuilder.group({
        name: [null, Validators.required],
        email: [null, Validators.required],
        telephone: [null, Validators.required],
        birthday: [null, Validators.required],
        job: [null, Validators.required],
        corretora: [''],
        seguradora: [''],
      })
  }

  get f() { return this.colaborador.controls; }

  onReset() {
    this.submitted = false;
    this.colaborador.reset();
  }

  onFinish() {
    this.submitted = true;
    if (this.colaborador.invalid) {
      return;
    }
    let newColaborador: Colaborador = {
      name: this.colaborador.value.name,
      telephone: this.colaborador.value.telephone,
      email: this.colaborador.value.email,
      birthday: this.colaborador.value.birthday,
      job: this.colaborador.value.job,
      corretora: this.colaborador.value.corretora,
      seguradora: this.colaborador.value.seguradora,
      active: true
    };
    if ((this.colaboradorService.getIsResponsible())&&(this.checkSelect)) {
      this.colaboradorService.setColaboradorResponsavel(this.colaborador, newColaborador);
    } else if ((this.colaboradorService.getIsResponsible())&&(!this.checkSelect)){
      this.colaboradorService.setColaboradorResponsavel(this.colaborador, newColaborador);
    } else {
      this.colaboradorService.cadastro(newColaborador);
    }
  }

  navigateLista() {
    this.router.navigate(['lista'])
  }

  ngOnInit() {
    let isCorretora = this.colaboradorService.getIsCorretora();
    let isSeguradora = this.colaboradorService.getIsSeguradora();
    if (isCorretora.isCorretora) {this.selectIndex = 1; this.selectTriggered = true; this.checkSelect = true; this.name = isCorretora.name}
    if (this.colaboradorService.getIsSeguradora()) {this.selectIndex = 2; this.checkSelect = false; this.selectTriggered = true;this.name = isSeguradora.name}
    if (this.colaboradorService.getColaboradorResponsavel()) {
      this.colaborador = this.colaboradorService.getColaboradorResponsavel();
    }
    this.colaboradorService.setIsResponsibleTrue();
    this.checkIsResonponsible = this.colaboradorService.getIsResponsible();
  }

}
