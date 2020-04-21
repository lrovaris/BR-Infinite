import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  checkMinhaConta = false;
  login: FormGroup;
  isAuth = false;
  submitted = false;

  logout() {
    this.servico.logout();
  }

  onHover() {
    this.checkMinhaConta = !this.checkMinhaConta;
  }

  loginMethod(user, pass) {
    this.servico.login(user, pass);
    this.isAuth = this.servico.getIsAuth();
    this.submitted = true;
  }

  constructor(private router: Router, private formbuilder: FormBuilder, private servico: LoginService) {
    this.login = this.formbuilder.group({
      login: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() { return this.login.controls; }

  navigateCadastro() {
    this.router.navigate(['cadastro']);
  }

  navigatehome(){
    this.router.navigate(['']);
  }
  navigateCategorias(){
    this.router.navigate(['categorias']);
  }
  navigateContato(){
    this.router.navigate(['contato']);
  }
  navigateMinhaConta(){
    this.router.navigate(['minhaConta']);
  }
  navigateLogin() {
    this.router.navigate(['login'])
  }

  ngOnInit(): void {
  }

}
