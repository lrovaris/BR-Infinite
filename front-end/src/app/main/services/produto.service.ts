import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import { UrlService  } from "./utils/url.service";

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private http: HttpClient, private router: Router, private urlService: UrlService) {}

  url = this.urlService.getUrl();

  produto: any;
  isEdit = false;


  saveProductInfo(produto) {
    this.produto = produto;
  }
  getProduto() {
    return this.produto;
  }

  goingToEdit() {
    this.isEdit = true;
  }

  getIsEdit() {
    return this.isEdit;
  }

  setProdutoNull() {
    this.produto = null;
  }

  setIsEditFalse() {
    this.isEdit = false;
  }

  editPostProduto(produto,id){
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/products/${id}/edit`, produto, options).subscribe((data:any) => {
      alert(data.message);
      this.router.navigate(['produtos'])
    })
  }

  postProduto(produto){
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/products/new`, produto, options).subscribe((data:any) => {
      alert(data.message);
      this.router.navigate(['produtos'])
    })
  }

  getAllProducts() {
    return this.http.get(`${this.url}/products/all`);
  }

  filterProductsList(filters) {

    return this.http.post(`${this.url}/products/filter`, {filters})

  }

}
