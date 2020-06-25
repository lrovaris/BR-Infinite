import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router} from "@angular/router";
import { ColaboradorService} from "../../services/colaborador.service";
import { SeguradoraService} from "../../services/seguradora.service";
import { CorretoraService} from "../../services/corretora.service";

@Component({
  selector: 'app-colaborador-page',
  templateUrl: './colaborador-page.component.html',
  styleUrls: ['./colaborador-page.component.scss']
})
export class ColaboradorPageComponent implements OnInit {

  @Input() inputLocalTrab

  localDeTrabalho: any;
  colaboradorForm: FormGroup;
  name: string = '';

  constructor(
              private formbuilder: FormBuilder,
              public colaboradorService: ColaboradorService,
              private router: Router,
              private seguradoraService: SeguradoraService,
              private corretoraService: CorretoraService) {

    this.colaboradorForm = this.formbuilder.group({
        name: [null, Validators.required],
        email: [null, Validators.required],
        telephone: [null, Validators.required],
        birthday: [null, Validators.required],
        job: [null, Validators.required],
        corretora: [''],
        seguradora: [''],
      })
  }

  ngOnInit() {

    console.log(this.inputLocalTrab);

    if (this.corretoraService.getcorretoraInfoWithOutFormGroup()) {
      this.localDeTrabalho = this.corretoraService.getcorretoraInfoWithOutFormGroup();
    }

    if (this.seguradoraService.getseguradoraInfoWithOutFormGroup()) {
      this.localDeTrabalho = this.seguradoraService.getseguradoraInfoWithOutFormGroup();
    }

    if(this.localDeTrabalho){
      this.colaboradorService.getColaborador(this.localDeTrabalho.manager._id).subscribe((data: any) => {
        this.colaboradorForm.controls['name'].setValue(data.name);
        this.colaboradorForm.controls['telephone'].setValue(data.telephone);
        this.colaboradorForm.controls['email'].setValue(data.email);
        this.colaboradorForm.controls['birthday'].setValue(data.birthday);
        this.colaboradorForm.controls['job'].setValue(data.job);
        this.colaboradorForm.controls['corretora'].setValue(data.corretora);
        this.colaboradorForm.controls['seguradora'].setValue(data.seguradora);
        this.saveColaborador();
        this.colaboradorService.setHasColaboradorChanged(false);
      });
    }


  }

  get f() { return this.colaboradorForm.controls; }


  saveColaborador() {
    this.colaboradorService.setHasColaboradorChanged(true);
    this.colaboradorService.setColaboradorResponsavel(this.getFormValue())
  }


  getFormValue() {
    return  {
      name: this.colaboradorForm.controls['name'].value,
      telephone: this.colaboradorForm.controls['telephone'].value,
      email: this.colaboradorForm.controls['email'].value,
      birthday: this.colaboradorForm.controls['birthday'].value,
      job: this.colaboradorForm.controls['job'].value,
      corretora: this.colaboradorForm.controls['corretora'].value,
      seguradora: this.colaboradorForm.controls['seguradora'].value,
    };
  }







}
