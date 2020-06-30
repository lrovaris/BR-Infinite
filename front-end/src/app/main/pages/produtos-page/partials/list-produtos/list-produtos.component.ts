import { Component, OnInit } from '@angular/core';
import {ProdutoService} from "../../../../services/produto.service";
import {Router} from "@angular/router";
import {SeguradoraService} from "../../../../services/seguradora.service";
import {OrdenaListService} from "../../../../services/utils/ordena-list.service";

@Component({
  selector: 'app-list-produtos',
  templateUrl: './list-produtos.component.html',
  styleUrls: ['./list-produtos.component.scss']
})
export class ListProdutosComponent implements OnInit {

  produtos = [];
  seguradoras = [];
  filterArray = [];

  filtered: boolean;

  constructor(private produtoService: ProdutoService,
              private router: Router,
              private seguradoraService: SeguradoraService,
              private ordena: OrdenaListService) { }

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

    this.filtered = false;

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
       this.ordena.ordenarAlfabetico(this.produtos, 'name')


      });
    });

  }


  filter() {
    this.produtoService.filterProductsList(this.filterArray).subscribe((data: any) => {
      setTimeout(()=> {
        console.log(data);
        this.produtos = data;
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
          this.ordena.ordenarAlfabetico(this.produtos, 'name')

        });
      })
    }, error1 => {
      alert(error1.error.message)
    });

    this.filtered = this.filterArray.length > 0;

  }

  pushFilterCard(value, type) {
    if (value === '') {
      return;
    }
    let filterObj = {
      value,
      type
    };
    this.filterArray.push(filterObj)
  }

  removeFilterCard(filterObj) {
    this.filterArray.splice(this.filterArray.indexOf(filterObj), 1 );
    this.filter();
  }

}
