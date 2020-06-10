import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../main/services/login.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  check = false;

  isLoggedIn = false;

  constructor(private router: Router, public loginService: LoginService) { }

  navigateCadastro() {
    this.check = !this.check;
    this.router.navigate(['cadastro'])
  }

  navigateLista() {
    this.check = !this.check;
    this.router.navigate(['lista'])
  }

  ngOnInit() {

    if (this.loginService.getIsAuth()) {
      this.isLoggedIn = true;
    }

  }

}
