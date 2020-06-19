import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DiasUteisService} from "../../services/dias-uteis.service";

@Component({
  selector: 'app-configuracao-page',
  templateUrl: './configuracao-page.component.html',
  styleUrls: ['./configuracao-page.component.scss']
})
export class ConfiguracaoPageComponent implements OnInit {

  diasUteis: FormGroup;

  allDiasUteis = [];

  constructor( private formbuilder: FormBuilder, private diasUteisService: DiasUteisService) {
    this.diasUteis = this.formbuilder.group({
      year: [null],
      dayNumber: [null],
      month: [null],
    })
  }

  onSubmit() {
    this.diasUteisService.postDiasUteisMes(this.diasUteis.value).subscribe((data: any) => {
      this.allDiasUteis.push(data.date);
      alert(data.message);
    }, error1 => {
      alert(error1.error.message)
    })
  }

  logForm() {
    console.log(this.diasUteis.value);
  }

  ngOnInit() {

    this.diasUteisService.getDiasUteisMes().subscribe((data: any) => {
      this.allDiasUteis = data;
      console.log(data);
    })

  }

}
