import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {PipelineService} from "../../services/pipeline.service";
import {SeguradoraService} from "../../services/seguradora.service";
import {CorretoraService} from "../../services/corretora.service";
import {ProdutoService} from "../../services/produto.service";

@Component({
  selector: 'app-pipeline-page',
  templateUrl: './pipeline-page.component.html',
  styleUrls: ['./pipeline-page.component.scss']
})
export class PipelinePageComponent implements OnInit {

  oportunidade: FormGroup;
  checkCongenere = false;
  isEdit = false;
  submitted = false;
  date: any;
  Seguradoras: any;
  Corretoras: any;
  Colaboradores: any;
  Produtos: any;
  CongenereList = [];

  constructor(private formbuilder: FormBuilder,
              public pipelineService: PipelineService,
              private router: Router,
              private seguradoraService: SeguradoraService,
              private corretoraService: CorretoraService,
              private produtoService: ProdutoService) {
    this.oportunidade = this.formbuilder.group({
      solicitante: [null, Validators.required],
      detentor: [null, Validators.required],
      cadastroNacional: [null, Validators.required],
      proponente: [null, Validators.required],
      seguradora: [null, Validators.required],
      corretora: [null, Validators.required],
      produto: [null, Validators.required],
      descricao: [null, Validators.required],
      tipoNegocio: [null, Validators.required],
      congenere: [null],
      congeneres: [null],
      status: [null],
      observacao: [null],
      preco1: [null],
      preco2: [null],
      comissao1: [null],
      comissao2: [null],
      brInfinite: [null],
      vigencia: [null]
    })
  }

  clickVerCongenere() {
    this.checkCongenere = !this.checkCongenere;
  }

  navigatePipeline() {
    this.router.navigate(['pipeline'])
  }


  pushCongenere(name, price, comission){
    this.CongenereList.push({name, price, comission})
  }
  removeCongenere(nome) {
    let index = this.CongenereList.indexOf(nome);
    if (index !== -1) this.CongenereList.splice(index, 1);
  }

  onFinish() {
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
      colaborador: this.oportunidade.value.solicitante,
      proponente: this.oportunidade.value.proponente,
      dealType: this.oportunidade.value.tipoNegocio,
      seguradora: this.oportunidade.value.seguradora,
      detentor: this.oportunidade.value.detentor,
      cadastroNacional: this.oportunidade.value.cadastroNacional,
      product: this.oportunidade.value.produto,
      description: this.oportunidade.value.descricao,
      congenereRenewal: this.oportunidade.value.congenere,
      congenereList: this.CongenereList,
      seguradoraPrice: this.oportunidade.value.preco2,
      seguradoraComission: this.oportunidade.value.comissao2,
      vigencia: this.oportunidade.value.vigencia,
      status: this.oportunidade.value.status,
      statusObs: this.oportunidade.value.observacao,

    };
    console.log(newOportunidade);
    if (this.isEdit) {
      let oportunidade = this.pipelineService.getOportunidadeWIthOutForm();
      this.pipelineService.editPostOportunidade(oportunidade._id, newOportunidade);
    } else if (!this.isEdit){
      this.pipelineService.postOportunidade(newOportunidade);
    }
   // this.oportunidade.reset();
  };


  selectColaborador(id){
    this.corretoraService.getCorretora(id).subscribe((data: any) => {
      this.Colaboradores = data.colaboradores;
    })
  }

  ngOnInit() {
    if (this.pipelineService.getIsEdit()) {
        if(this.pipelineService.getOportunidadeWIthOutForm()) {
          this.isEdit = true;
          let data = this.pipelineService.getOportunidadeWIthOutForm();
          this.CongenereList = data.congenereList;
          this.oportunidade.controls['corretora'].setValue(data.corretora);
          this.oportunidade.controls['solicitante'].setValue(data.colaborador);
          this.oportunidade.controls['detentor'].setValue(data.detentor);
          this.oportunidade.controls['cadastroNacional'].setValue(data.cadastroNacional);
          this.oportunidade.controls['proponente'].setValue(data.proponente);
          this.oportunidade.controls['tipoNegocio'].setValue(data.dealType);
          this.oportunidade.controls['congenere'].setValue(data.congenereRenewal);
          this.oportunidade.controls['status'].setValue(data.status);
          this.oportunidade.controls['observacao'].setValue(data.statusObs);
          this.oportunidade.controls['produto'].setValue(data.product);
          this.oportunidade.controls['descricao'].setValue(data.description);
          this.oportunidade.controls['seguradora'].setValue(data.seguradora);
          this.oportunidade.controls['brInfinite'].setValue(data.seguradora);
          this.oportunidade.controls['preco2'].setValue(data.seguradoraPrice);
          this.oportunidade.controls['comissao2'].setValue(data.seguradoraComission);
          this.oportunidade.controls['vigencia'].setValue(data.vigencia);
        }
    }
    this.seguradoraService.getAllSeguradoras().subscribe((data: any) => {
      this.Seguradoras = data;
    });
    this.corretoraService.getAllCorretoras().subscribe((data: any) => {
      this.Corretoras = data;
    });
    this.produtoService.getAllProducts().subscribe((data: any) => {
      this.Produtos = data;
    })

  }

}
