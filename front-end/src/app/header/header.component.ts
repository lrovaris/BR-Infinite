import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../main/services/login.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {



  constructor(private router: Router, public service: LoginService) { }

  navigateLogin() {
    this.router.navigate([''])
  }
  navigateHome() {
    this.router.navigate(['home'])
  }
  navigateSeguradora() {
    this.router.navigate(['seguradora'])
  }
  navigateCorretora() {
    this.router.navigate(['corretora'])
  }
  navigatePipeline() {
    this.router.navigate(['pipeline'])
  }
  navigateProducao() {
    this.router.navigate(['producao'])
  }

  ngOnInit() {
  }

}
