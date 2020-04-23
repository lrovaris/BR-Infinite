import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CorretoraService} from "../../services/corretora.service";
import {SeguradoraService} from "../../services/seguradora.service";
import {ProdutoService} from "../../services/produto.service";

@Component({
  selector: 'app-produtos-page',
  templateUrl: './produtos-page.component.html',
  styleUrls: ['./produtos-page.component.scss']
})
export class ProdutosPageComponent implements OnInit {

  produto: FormGroup;
  seguradoras = [];
  submitted = false;
  allSeguradoras: Array<any> = [];


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
        seguradoras: this.seguradoras
      };
    this.produtoService.postProduto(newProduto);
    this.produto.reset();
  };

  ngOnInit() {
    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.allSeguradoras = data
    })
  }

}
