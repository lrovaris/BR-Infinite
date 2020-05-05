import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  url = 'http://162.214.89.17:3000'; // 162.214.89.17:3000
  produto: any;
  isEdit = false;

  constructor(private http: HttpClient, private router: Router) {}

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
      alert(data.message)
    })
  }

  postProduto(produto){
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/products/new`, produto, options).subscribe((data:any) => {
  alert(data.message)
    })
  }

  getAllProducts() {
    return this.http.get(`${this.url}/products/all`);
  }

}
