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
    this.seguradoraService.setseguradoraInfoWithOutFormGroupNull();
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
    this.corretoraService.getAllCorretoras().subscribe((prod_data:any) => {
      this.corretoras = prod_data;
      this.seguradoraService.getAllSeguradoras().subscribe((seg_data:any) => {
        this.seguradoras = seg_data;
        console.log(this.seguradoras);
        this.corretoras = this.corretoras.map(prod => {

          prod.seguradoras = prod.seguradoras.map(prod_seg => {
            console.log(prod_seg);
            let seg = this.seguradoras.find(seg_data => prod_seg.toString() === seg_data._id.toString());

            return {
              name: seg.name,
              _id: seg._id,
              telephone: seg.telephone,
              email: seg.email
            }
          });
          return prod;
        });
        console.log(this.corretoras);
      });
    });
  }



}
