import { Component, OnInit } from '@angular/core';
import {SeguradoraService} from "../../../../services/seguradora.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-seguradora',
  templateUrl: './list-seguradora.component.html',
  styleUrls: ['./list-seguradora.component.scss']
})
export class ListSeguradoraComponent implements OnInit {

  seguradoras = [];

  constructor(private seguradoraService: SeguradoraService, private router: Router) { }

  navigateCadastroSeguradora() {
    this.router.navigate(['seguradora/cadastro'])
  }

  ngOnInit() {
    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
     this.seguradoras = data;
    })
  }

}
