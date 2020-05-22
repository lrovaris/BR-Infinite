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
    this.produtoService.setProdutoNull();
    this.produtoService.setIsEditFalse();
    this.router.navigate(['produtos/cadastro'])
  }

  navigateView(produto) {
    this.produtoService.saveProductInfo(produto);
    this.router.navigate(['produtos/visualizacao'])
  }

  ngOnInit() {
    this.produtoService.getAllProducts().subscribe((prod_data:any) => {
      this.produtos = prod_data;
      this.seguradoraService.getAllSeguradoras().subscribe((seg_data:any) => {
        this.seguradoras = seg_data;

        this.produtos = this.produtos.map(prod => {

          prod.seguradoras = prod.seguradoras.map(prod_seg => {

            let seg = this.seguradoras.find(seg_obj => prod_seg.toString() === seg_obj._id.toString());

            return {
              name: seg.name,
              _id: seg._id,
              telephone: seg.telephone,
              email: seg.email
            }
          });

          return prod;
        });

        console.log(this.produtos);


      });
    });

  }

}
