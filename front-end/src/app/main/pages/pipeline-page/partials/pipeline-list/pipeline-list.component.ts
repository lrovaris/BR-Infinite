import { Component, OnInit } from '@angular/core';
import {PipelineService} from "../../../../services/pipeline.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pipeline-list',
  templateUrl: './pipeline-list.component.html',
  styleUrls: ['./pipeline-list.component.scss']
})
export class PipelineListComponent implements OnInit {

  oportunidade = [];
  isInclusionDate = false;
  filterArray = [];
  filterInput = '';
  filterInputDateBefore: any;
  filterInputDateAfter: any;
  filterObj: any;
  filterObj2: any;
  isVigencia = false;

  constructor(private pipelineService: PipelineService, private router: Router) { }

  saveOportunidade(oportundiade) {
    this.pipelineService.setOportunidade(oportundiade);
    this.router.navigate(['pipeline/visualizacao'])
  }

  navigateCadastro(){
    this.pipelineService.setIsEditFalse();
    this.router.navigate(['pipeline/cadastro'])
  }

  ngOnInit() {
    this.pipelineService.getAllOportunidades().subscribe((data: any) => {
      this.oportunidade = data;
    })
  }

  selectChange(value) {
    this.isInclusionDate = value === 'inclusionDate';
    this.isVigencia = value === 'vigencia';
  }

  filter() {
    this.pipelineService.filterPipelineList(this.filterArray).subscribe((data: any) => {
      setTimeout(()=> {
        console.log(data);
        this.oportunidade = data;
      })
    }, error1 => {
      alert(error1.error.message)
    });

  }

  pushFilterCard(value, type, valueDateBefore, valueDateAfter) {


    if (this.isInclusionDate || this.isVigencia) {
      if (valueDateBefore === '' || valueDateAfter === '') {
        return;
      }

      if (type === 'vigencia') {
        this.filterObj = {
          value: this.FormataStringData(valueDateBefore),
          type: 'vigenciaBefore'
        };
        this.filterObj2 = {
          value: this.FormataStringData(valueDateAfter),
          type: 'vigenciaAfter'
        };
      } else if (type === 'inclusionDate') {
        this.filterObj = {
          value: this.FormataStringData(valueDateBefore),
          type: 'inclusionDateBefore'
        };
        this.filterObj2 = {
          value: this.FormataStringData(valueDateAfter),
          type: 'inclusionDateAfter'
        };
      }

      this.filterArray.push(this.filterObj2);
      this.filterArray.push(this.filterObj)
    } else {
      if (value === '') {
        return;
      }
       this.filterObj = {
        value,
        type
      };
      this.filterArray.push(this.filterObj)
    }


  }

  removeFilterCard(filterObj) {
    this.filterArray.splice(this.filterArray.indexOf(filterObj), 1 );
    this.filter();
  }

  FormataStringData(data) {
    let ano  = data.split("-")[0];
    let mes  = data.split("-")[1];
    let dia  = data.split("-")[2];

    if ((mes) && (dia)) {
      return dia + '-' + (mes) + '-' + (ano)
    }

    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }

}
