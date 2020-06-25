import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CorretoraService } from "../../../../services/corretora.service";
import {SeguradoraService} from "../../../../services/seguradora.service";
import {ColaboradorService} from "../../../../services/colaborador.service";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-list-corretora',
  templateUrl: './list-corretora.component.html',
  styleUrls: ['./list-corretora.component.scss']
})
export class ListCorretoraComponent implements OnInit {

  corretoras = [];
  seguradoras = [];
  filterArray = [];

  filtered: boolean;

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

  navigateToView(id) {
    this.corretoraService.getCorretora(id).subscribe((data: any) => {
      this.corretoraService.navigateToViewCorretora(data);
    })
  }

  ngOnInit() {
    this.filtered = false;
    this.corretoraService.getAllCorretoras().subscribe((prod_data:any) => {
      this.corretoras = prod_data;
      this.seguradoraService.getAllSeguradoras().subscribe((seg_data:any) => {
        this.seguradoras = seg_data;
        this.corretoras = this.corretoras.map(prod => {

          prod.seguradoras = prod.seguradoras.map(prod_seg => {
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
      });
    });
  }

  downloadCsv() {
    this.corretoraService.downloadAllCsv(this.filterArray).subscribe((data: any) => {
      saveAs(data, 'corretoras-report.csv');
    })
  }

  filter() {
    this.corretoraService.filterCorretoraList(this.filterArray).subscribe((data: any) => {
      setTimeout(()=> {
        console.log(data);
        this.corretoras = data;
      })
    }, error1 => {
      alert(error1.error.message)
    });

    this.filtered = this.filterArray.length > 0;

  }

  pushFilterCard(value, type) {
    if (value === '') {
      return;
    }
    let filterObj = {
      value,
      type
    };
    this.filterArray.push(filterObj)
  }

  removeFilterCard(filterObj) {
    this.filterArray.splice(this.filterArray.indexOf(filterObj), 1 );
    this.filter();
  }

}
