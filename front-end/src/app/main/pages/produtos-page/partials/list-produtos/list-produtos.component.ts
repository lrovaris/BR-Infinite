import { Component, OnInit } from '@angular/core';
import {ProdutoService} from "../../../../services/produto.service";
import {Router} from "@angular/router";
import {SeguradoraService} from "../../../../services/seguradora.service";

@Component({
  selector: 'app-list-produtos',
  templateUrl: './list-produtos.component.html',
  styleUrls: ['./list-produtos.component.scss']
})
export class ListProdutosComponent implements OnInit {
  produtos = [];
  seguradoras = [];

  constructor(private produtoService: ProdutoService, private router: Router, private seguradoraService: SeguradoraService) { }

  navigateCadastroProduto() {
    this.router.navigate(['produtos/cadastro'])
  }

  ngOnInit() {
    this.produtoService.getAllProducts().subscribe((data:any) => {
      this.produtos = data;
    });
    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.seguradoras = data;
    });
  }

}
