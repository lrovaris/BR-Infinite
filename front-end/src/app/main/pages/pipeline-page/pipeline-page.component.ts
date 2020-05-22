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
  Files = [];
  filesToUpload: Array<File> = [];
  formData: any = new FormData();

  constructor(private formbuilder: FormBuilder,
              public pipelineService: PipelineService,
              private router: Router,
              private seguradoraService: SeguradoraService,
              private corretoraService: CorretoraService,
              private produtoService: ProdutoService) {
    this.oportunidade = this.formbuilder.group({
      solicitante: ['', Validators.required],
      detentor: ['', Validators.required],
      cadastroNacional: [''],
      proponente: ['', Validators.required],
      seguradora: ['', Validators.required],
      corretora: ['', Validators.required],
      produto: ['', Validators.required],
      descricao: [''],
      tipoNegocio: ['', Validators.required],
      congenere: [''],
      congeneres: [''],
      status: ['', Validators.required],
      observacao: [''],
      preco1: [''],
      preco2: [''],
      comissao1: [''],
      comissao2: [''],
      brInfinite: [''],
      upload: [''],
      vigencia: ['']
    })
  }

  clickVerCongenere() {
    this.checkCongenere = !this.checkCongenere;
  }


  navigatePipeline() {
    this.router.navigate(['pipeline'])
  }


  pushCongenere(name, price, comission){
    this.CongenereList.push({name, price, comission});

    console.log(this.oportunidade.controls);

    this.oportunidade.controls["congeneres"].setValue("");
    this.oportunidade.controls["preco1"].setValue("");
    this.oportunidade.controls["comissao1"].setValue("");
  }
  removeCongenere(nome) {
    let index = this.CongenereList.indexOf(nome);
    if (index !== -1) this.CongenereList.splice(index, 1);
  }

  removeFile(nome){
    let index = this.filesToUpload.indexOf(nome);
    if (index !== -1) this.filesToUpload.splice(index, 1);
  }


  upload(event: any) {
    let newFile = event.target.files[0];
    this.filesToUpload.push(newFile);
  }

  FormataStringData(data) {
    let ano  = data.split("-")[0];
    let mes  = data.split("-")[1];
    let dia  = data.split("-")[2];

    if ((mes) && (dia)) {
      return dia + '/' + (mes) + '/' + (ano)
    } else {
      return ano;
    }

    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
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

    this.date = dd + '/' + mm + '/' + yyyy;
    this.date = {
      now: dd + '/' + mm + '/' + yyyy,
      mm,
      dd,
      yyyy
    };

    let dataVigencia = this.oportunidade.value.vigencia;
    dataVigencia = this.FormataStringData(dataVigencia);

    console.log(dataVigencia);

    const inclusionDate = this.date.now;

    let newOportunidade = {
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
      seguradoraComission: (this.oportunidade.value.comissao2),
      vigencia: dataVigencia,
      status: this.oportunidade.value.status,
      statusObs: this.oportunidade.value.observacao,

    };
    console.log(newOportunidade);
      const files: Array<File> = this.filesToUpload;
    for(let i =0; i < files.length; i++) {
      this.formData.append('docs', files[i]);
    }
      this.pipelineService.postUpload(this.formData).subscribe((data: any) => {
        console.log(data);
        for(let i = 0; i < data.info_files.length; i++) {
          this.Files.push(data.info_files[i]);
        }
        newOportunidade['files'] = this.Files;
        if (this.isEdit) {
          let oportunidade = this.pipelineService.getOportunidadeWIthOutForm();
          this.pipelineService.editPostOportunidade(oportunidade._id, newOportunidade)
        } else if (!this.isEdit) {
          newOportunidade['inclusionDate'] = this.date.now;
          this.pipelineService.postOportunidade(newOportunidade).subscribe((data:any) => {
            alert(data.message);
            this.router.navigate(['pipeline'])
          })
        }
      });


   // this.oportunidade.reset();
  };


  selectColaborador(id){
    this.corretoraService.getCorretora(id).subscribe((data: any) => {
      console.log(data);
      this.Colaboradores = []

      for (let index = 0; index < data.colaboradores.length; index++) {
        this.Colaboradores.push(data.colaboradores[index]);
      }
      this.Colaboradores.push(data.manager);
    })
  }

  ngOnInit() {

    this.seguradoraService.getAllSeguradoras().subscribe((seg_data: any) => {
      this.Seguradoras = seg_data;
      this.corretoraService.getAllCorretoras().subscribe((corr_data: any) => {
        this.Corretoras = corr_data;
        this.produtoService.getAllProducts().subscribe((prod_data: any) => {
          this.Produtos = prod_data;


          if (this.pipelineService.getIsEdit()) {
              if(this.pipelineService.getOportunidadeWIthOutForm()) {
                this.isEdit = true;
                let data = this.pipelineService.getOportunidadeWIthOutForm();
                this.Files = data.files;
                this.selectColaborador(data.corretora._id || data.corretora)

                this.CongenereList = data.congenereList;
                this.oportunidade.controls['corretora'].setValue(data.corretora._id || data.corretora);
                this.oportunidade.controls['solicitante'].setValue(data.colaborador._id || data.colaborador);
                this.oportunidade.controls['detentor'].setValue(data.detentor);
                this.oportunidade.controls['cadastroNacional'].setValue(data.cadastroNacional);
                this.oportunidade.controls['proponente'].setValue(data.proponente);
                this.oportunidade.controls['tipoNegocio'].setValue(data.dealType);
                this.oportunidade.controls['congenere'].setValue(data.congenereRenewal);
                this.oportunidade.controls['status'].setValue(data.status);
                this.oportunidade.controls['observacao'].setValue(data.statusObs);
                this.oportunidade.controls['produto'].setValue(data.product._id || data.product);
                this.oportunidade.controls['descricao'].setValue(data.description);
                this.oportunidade.controls['seguradora'].setValue(data.seguradora._id ||data.seguradora);
                // this.oportunidade.controls['brInfinite'].setValue(data.seguradora);
                this.oportunidade.controls['preco2'].setValue(data.seguradoraPrice);
                this.oportunidade.controls['comissao2'].setValue(data.seguradoraComission);
                this.oportunidade.controls['vigencia'].setValue(data.vigencia);

              }
          }

        })
      });
    });
  }

}
