import { Component, OnInit } from '@angular/core';
import {SeguradoraService} from "../../../../services/seguradora.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-seguradora-view',
  templateUrl: './seguradora-view.component.html',
  styleUrls: ['./seguradora-view.component.scss']
})
export class SeguradoraViewComponent implements OnInit {

  seguradora: any;

  constructor(private seguradoraService: SeguradoraService, private router: Router) { }

  navigateEdit() {
    this.router.navigate(['seguradora/cadastro'])
  }

  ngOnInit() {
    this.seguradora = this.seguradoraService.getseguradoraInfoWithOutFormGroup();
  }

}
