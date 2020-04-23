import {Component, Input, OnInit} from '@angular/core';
import {SeguradoraService} from "../../../../services/seguradora.service";

@Component({
  selector: 'app-corretora-card-select-partial',
  templateUrl: './corretora-card-select-partial.component.html',
  styleUrls: ['./corretora-card-select-partial.component.scss']
})
export class CorretoraCardSelectPartialComponent implements OnInit {

  @Input() nome: string;
  condition = false;

  modifyArray() {
    if (this.condition) {
      this.service.addArray(this.nome);
    } else {
      this.service.removeArray(this.nome);
    }
  }

  constructor(private service: SeguradoraService) { }

  ngOnInit() {
  }

}
