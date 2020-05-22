import { Component, OnInit } from '@angular/core';
import { SeguradoraService} from "../../services/seguradora.service";
import { Router} from "@angular/router";
import { ProducaoService} from "../../services/producao.service";
import { CorretoraService} from "../../services/corretora.service";

@Component({
  selector: 'app-producao-page',
  templateUrl: './producao-page.component.html',
  styleUrls: ['./producao-page.component.scss']
})
export class ProducaoPageComponent implements OnInit {

  allSeguradoras = [];
  allProducoes = [];
  seguradora = [];
  corretora = [];

  constructor(
              private seguradoraService: SeguradoraService,
              private router: Router,
              private producaoService: ProducaoService,
              private corretoraService: CorretoraService
  ) { }

  navigateEnviarAnexo() {
    this.router.navigate(['producao/enviar']);
  }

  ngOnInit() {
    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.allSeguradoras = data;
    });

    this.producaoService.getAllProducao().subscribe((data: any) => {
      this.allProducoes = data;
      this.seguradoraService.getAllSeguradoras().subscribe((seg_data:any) => {
        this.seguradora = seg_data;
        this.allProducoes = this.allProducoes.map(prod => {
            let seg = this.seguradora.find(seg_obj => prod.seguradora.toString() === seg_obj._id.toString());
           let seguradora = {
              name: seg.name,
              _id: seg._id,
              telephone: seg.telephone,
              email: seg.email
            };
          prod.seguradora = seguradora;
          return prod;
        });
        console.log(this.allProducoes);
      });
      this.corretoraService.getAllCorretoras().subscribe((cor_data:any) => {
        this.corretora = cor_data;
        this.allProducoes = this.allProducoes.map(prod => {
          let cor = this.corretora.find(cor_obj => prod.corretora.toString() === cor_obj._id.toString());
          let corretora = {
            name: cor.name,
            _id: cor._id,
            telephone: cor.telephone,
            email: cor.email
          };
          prod.corretora = corretora;
          return prod;
        });
        console.log(this.allProducoes);
      });

    })






  }

}
