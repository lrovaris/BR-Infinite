import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MustMatch} from "./partials/must-match.validator";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-cadastro-page',
  templateUrl: './cadastro-page.component.html',
  styleUrls: ['./cadastro-page.component.scss']
})
export class CadastroPageComponent implements OnInit {

  submitted = false;
  cliente: FormGroup;

  constructor( private formbuilder: FormBuilder, private servico: LoginService, private router: Router) {
    this.cliente = this.formbuilder.group({
        login: [null, Validators.required],
        password: [null, [Validators.required, Validators.minLength(6)]],
        resenha: [null, Validators.required],
        name: [null, Validators.required]
      },
      {
        validator: MustMatch('password', 'resenha')
      });
  }

  get f() { return this.cliente.controls; }

  onReset() {
    this.submitted = false;
    this.cliente.reset();
  }

  onSubmit() {
    this.submitted = true;
    if (this.cliente.invalid) {
      console.log('invalid-retornando');
      return;
    }
    let newCliente = {
      login: this.cliente.value.login,
      password: this.cliente.value.password,
      name: this.cliente.value.name
    };
    this.servico.cadastro(newCliente);
    this.onReset();
  }

  ngOnInit() {
  }

}
