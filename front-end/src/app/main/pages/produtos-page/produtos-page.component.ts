import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CorretoraService } from "../../services/corretora.service";
import { SeguradoraService } from "../../services/seguradora.service";
import { ProdutoService } from "../../services/produto.service";

@Component({
  selector: 'app-produtos-page',
  templateUrl: './produtos-page.component.html',
  styleUrls: ['./produtos-page.component.scss']
})
export class ProdutosPageComponent implements OnInit {

  produto: FormGroup;
  seguradoras = [];
  seguradorasTable = [];
  submitted = false;
  allSeguradoras: Array<any> = [];
  selectableSeguradoras = [];
  editProduto: any;


  constructor(
    private formbuilder: FormBuilder,
    public produtoService: ProdutoService,
    private router: Router,
    private corretoraService: CorretoraService,
    private seguradoraService: SeguradoraService) {

    this.produto = this.formbuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required]
    })
  }

  onFinish() {
    this.submitted = true;
    if (this.produto.invalid) {
      alert('Formulário invalido, por favor verifique os campos');
      return;
    }
    this.seguradoras = this.seguradoraService.getSeguradoras();
    let newProduto = {
        name: this.produto.value.name,
        description: this.produto.value.description,
        seguradoras: this.seguradorasTable.map(seg => seg._id.toString())
      };

      console.log(newProduto);


    if (this.produtoService.getIsEdit()) {
      this.produtoService.setIsEditFalse();
      this.produtoService.editPostProduto(newProduto, this.editProduto._id);
    } else {
      this.produtoService.postProduto(newProduto);
    }
    this.produto.reset();
  };

  navigateProduto() {
    this.router.navigate(['produtos'])
  }

  ngOnInit() {
    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.allSeguradoras = data
      this.selectableSeguradoras = data;

      if (this.produtoService.getIsEdit()) {
        this.editProduto = this.produtoService.getProduto();

        this.seguradorasTable = this.editProduto.seguradoras

        this.produto.controls['name'].setValue(this.editProduto.name);
        this.produto.controls['description'].setValue(this.editProduto.description);

        this.filterSelectableSeguradoras();
      }
    });
  }

  filterSelectableSeguradoras(){
    let seg_id_list = this.seguradorasTable.map(seg => seg._id.toString());

    this.selectableSeguradoras = this.allSeguradoras.filter(seg => {
      return !seg_id_list.includes(seg._id.toString());
    });
  }

  addSeguradora(seg){
    let seguradora = this.allSeguradoras.find(seg_obj => seg_obj._id.toString() === seg.toString())

    this.seguradorasTable.push(seguradora)

    this.filterSelectableSeguradoras();
  }

  removeSeguradora(seg){
    this.seguradorasTable.splice(this.seguradorasTable.indexOf(seg), 1 );

    this.filterSelectableSeguradoras();
  }



}
