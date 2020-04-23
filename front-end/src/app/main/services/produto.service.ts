import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  url = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  postProduto(produto){
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/products/new`, produto, options).subscribe((data:any) => {
  alert(data.Message)
    })
  }

  getAllProducts() {
    return this.http.get(`${this.url}/products/all`);
  }

}
