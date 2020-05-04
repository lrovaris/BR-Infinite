import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {PipelineService} from "../../services/pipeline.service";

@Component({
  selector: 'app-pipeline-page',
  templateUrl: './pipeline-page.component.html',
  styleUrls: ['./pipeline-page.component.scss']
})
export class PipelinePageComponent implements OnInit {

  oportunidade: FormGroup;
  isEdit = false;
  submitted = false;
  date: any;

  constructor(private formbuilder: FormBuilder,
              public pipelineService: PipelineService,
              private router: Router) {
    this.oportunidade = this.formbuilder.group({
      solicitante: [null, Validators.required],
      detentor: [null, Validators.required],
      registroNacional: [null, Validators.required],
      proponente: [null, Validators.required],
      seguradora: [null, Validators.required],
      corretora: [null, Validators.required],
      produto: [null, Validators.required],
      descricao: [null, Validators.required],
      tipoNegocio: [null, Validators.required],
      congenere: [null, Validators.required],
      congeneres: [null, Validators.required],
      status: [null],
      observacao: [null, Validators.required],
      preco1: [null],
      preco2: [null],
      comissao1: [null],
      comissao2: [null],
      brInfinite: [null]
    })
  }

  navigatePipeline() {
    this.router.navigate(['pipeline'])
  }

  onFinish() {
    console.log(this.oportunidade);
    this.submitted = true;
    if (this.oportunidade.invalid) {
      alert('Formulário Inválido, por favor verifique ');
      return;
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    this.date = mm + '/' + dd + '/' + yyyy;
    this.date = {
      now: mm + '/' + dd + '/' + yyyy,
      mm,
      dd,
      yyyy
    };

    const inclusionDate = this.date.now;

    let newOportunidade = {
      inclusionDate: this.date.now,
      corretora: this.oportunidade.value.corretora,
      seguradora: this.oportunidade.value.seguradora,
      detentor: this.oportunidade.value.detentor,
      cadastroNacional: this.oportunidade.value.cadastroNacional,
      product: this.oportunidade.value.product,
      description: this.oportunidade.value.description,
      dealType: this.oportunidade.value.dealType,
      counterpart: this.oportunidade.value.counterpart,
      status: this.oportunidade.value.status,
      statusObs: this.oportunidade.value.ob
    };
    if (this.isEdit) {
      console.log('isedit');
      let oportunidade = this.pipelineService.getOportunidadeWIthOutForm();
      console.log(oportunidade);
      this.pipelineService.editPostOportunidade(oportunidade._id, newOportunidade);
    } else if (!this.isEdit){
      console.log('isnotedit');
      this.pipelineService.postOportunidade(newOportunidade);
    }
    this.oportunidade.reset();
  };

  ngOnInit() {
    if (this.pipelineService.getIsEdit()) {
        if(this.pipelineService.getOportunidadeWIthOutForm()) {
          this.isEdit = true;
          let data = this.pipelineService.getOportunidadeWIthOutForm();
          this.oportunidade.controls['corretora'].setValue(data.corretora);
          this.oportunidade.controls['solicitante'].setValue(data.solicitante);
          this.oportunidade.controls['detentor'].setValue(data.detentor);
          this.oportunidade.controls['cnpj'].setValue(data.cnpj);
          this.oportunidade.controls['proponente'].setValue(data.proponente);
          this.oportunidade.controls['tipoNegocio'].setValue(data.tipoNegocio);
          this.oportunidade.controls['congenere'].setValue(data.congenere);
          this.oportunidade.controls['congeneres'].setValue(data.congeneres);
          this.oportunidade.controls['status'].setValue(data.status);
          this.oportunidade.controls['observacao'].setValue(data.observacao);
          this.oportunidade.controls['produto'].setValue(data.produto);
          this.oportunidade.controls['descricao'].setValue(data.descricao);
        }
    }
  }

}
