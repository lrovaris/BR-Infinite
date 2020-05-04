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

  constructor(private pipelineService: PipelineService, private router: Router) { }

  navigateCadastro(){
    this.router.navigate(['pipeline/cadastro'])
  }
  edit(id) {

  }

  ngOnInit() {
    this.pipelineService.getAllOportunidades().subscribe((data: any) => {
      this.oportunidade = data;
    })
  }

}
