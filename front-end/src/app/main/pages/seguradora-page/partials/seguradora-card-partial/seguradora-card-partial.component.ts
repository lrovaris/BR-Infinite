import {Component, Input, OnInit} from '@angular/core';
import {SeguradoraService} from "../../../../services/seguradora.service";

@Component({
  selector: 'app-seguradora-card-partial',
  templateUrl: './seguradora-card-partial.component.html',
  styleUrls: ['./seguradora-card-partial.component.scss']
})
export class SeguradoraCardPartialComponent implements OnInit {

  @Input() nome: string;
  @Input() seguradora: any;
  condition = false;



  modifyArray() {
    if (this.condition) {
      this.service.addArray(this.seguradora);
    } else {
      this.service.removeArray(this.seguradora);
    }
  }

  constructor(private service: SeguradoraService) { }

  ngOnInit() {
  }

}
