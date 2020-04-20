import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  check = false;

  constructor(private router: Router) { }

  navigateCadastro() {
    this.check = !this.check;
    this.router.navigate(['cadastro'])
  }

  navigateLista() {
    this.check = !this.check;
    this.router.navigate(['lista'])
  }

  ngOnInit() {
  }

}
