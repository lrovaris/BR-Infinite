import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ColaboradorService} from "../../services/colaborador.service";
import {Colaborador} from "./Colaborador";
import {SeguradoraService} from "../../services/seguradora.service";
import {CorretoraService} from "../../services/corretora.service";

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
  localDeTrabalho: any;


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


  constructor(
              private formbuilder: FormBuilder,
              public colaboradorService: ColaboradorService,
              private router: Router,
              private seguradoraService: SeguradoraService,
              private corretoraService: CorretoraService) {

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

  navigateBack() {
    if (this.colaboradorService.getCameFromSeguradora()) {
      this.seguradoraService.getSeguradora(this.colaboradorService.workId).subscribe((data: any) => {
        this.seguradoraService.editSeguradora(data)
      });
    } else if (this.colaboradorService.getCameFromCorretora()) {
      this.corretoraService.getCorretora(this.colaboradorService.workId).subscribe((data: any) => {
        this.corretoraService.editCorretora(data)
      });
    }
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
    this.colaboradorService.setColaboradorResponsavel(this.colaborador, newColaborador);
  }

  saveColaborador() {
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
    this.colaboradorService.setColaboradorResponsavel(this.colaborador, newColaborador)
  }

  postColaborador() {
    console.log(this.colaboradorService.workId);
    this.submitted = true;
    if (this.colaborador.invalid) {
      return;
    }

    if (this.colaboradorService.getCameFromCorretora()) {
      let newColaborador: Colaborador = {
        name: this.colaborador.value.name,
        telephone: this.colaborador.value.telephone,
        email: this.colaborador.value.email,
        birthday: this.colaborador.value.birthday,
        job: this.colaborador.value.job,
        corretora: this.colaboradorService.workId,
        seguradora: '',
        active: true
      };
      this.colaboradorService.postColaborador(newColaborador).subscribe((data: any) => {
        alert(data.message);
        this.colaborador.reset();
      })
    } else if (this.colaboradorService.getCameFromSeguradora()) {
      let newColaborador: Colaborador = {
        name: this.colaborador.value.name,
        telephone: this.colaborador.value.telephone,
        email: this.colaborador.value.email,
        birthday: this.colaborador.value.birthday,
        job: this.colaborador.value.job,
        corretora: '',
        seguradora: this.colaboradorService.workId,
        active: true
      };
      this.colaboradorService.postColaborador(newColaborador).subscribe((data: any) => {
        alert(data.message);
        this.colaborador.reset();
      })
    }


  }

  navigateLista() {
    this.router.navigate(['lista'])
  }

  ngOnInit() {
    let isCorretora = this.colaboradorService.getIsCorretora();
    let isSeguradora = this.colaboradorService.getIsSeguradora();

    if (this.corretoraService.getcorretoraInfoWithOutFormGroup()) {
      this.localDeTrabalho = this.corretoraService.getcorretoraInfoWithOutFormGroup();

    } else if (this.seguradoraService.getseguradoraInfoWithOutFormGroup()) {
      this.localDeTrabalho = this.seguradoraService.getseguradoraInfoWithOutFormGroup();
    }

    this.colaboradorService.getColaborador(this.localDeTrabalho.manager._id).subscribe((data: any) => {
      this.colaborador.controls['name'].setValue(data.name);
      this.colaborador.controls['telephone'].setValue(data.telephone);
      this.colaborador.controls['email'].setValue(data.email);
      this.colaborador.controls['birthday'].setValue(data.birthday);
      this.colaborador.controls['job'].setValue(data.job);
      this.colaborador.controls['corretora'].setValue(data.corretora);
      this.colaborador.controls['seguradora'].setValue(data.seguradora);
    });


    if (isCorretora.isCorretora) {
      this.selectIndex = 1;
      this.selectTriggered = true;
      this.checkSelect = true;
      this.name = isCorretora.name
    }
    if (isSeguradora.isSeguradora) {
      this.selectIndex = 2;
      this.selectTriggered = true;
      this.checkSelect = false;
      this.name = isSeguradora.name
    }
    if (this.colaboradorService.getColaboradorResponsavel()) {
      this.colaborador = this.colaboradorService.getColaboradorResponsavel();
    }
    this.colaboradorService.setIsResponsibleTrue();
    this.checkIsResonponsible = this.colaboradorService.getIsResponsible();

    if((this.colaboradorService.checkCameFromCorretoraList) || (this.colaboradorService.checkCameFromSeguradoraList)) {
      this.checkIsResonponsible = false;
    }

  }




}
