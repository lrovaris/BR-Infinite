import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CorretoraService } from "../../../../services/corretora.service";
import {SeguradoraService} from "../../../../services/seguradora.service";
import {ColaboradorService} from "../../../../services/colaborador.service";

@Component({
  selector: 'app-list-corretora',
  templateUrl: './list-corretora.component.html',
  styleUrls: ['./list-corretora.component.scss']
})
export class ListCorretoraComponent implements OnInit {

  corretoras = [];
  seguradoras = [];

  constructor(private corretoraService: CorretoraService,
              private router: Router,
              private seguradoraService: SeguradoraService,
              private colaboradorService: ColaboradorService) { }

  navigateCadastroCorretora() {
    this.colaboradorService.setColaboradorResponsavelNull();
    this.corretoraService.setCorretoraInfoWithOutFormGroupNull();
    this.router.navigate(['corretora/cadastro'])
  }

  editCorretora(id) {
    this.colaboradorService.setColaboradorResponsavelNull();
    this.corretoraService.getCorretora(id).subscribe((data: any) => {
      this.corretoraService.editCorretora(data);
    })
  }

  ngOnInit() {
    this.corretoraService.getAllCorretoras().subscribe((data:any) => {
      this.corretoras = data;
    });
    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.seguradoras = data;
    });
  }

}
