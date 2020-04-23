import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  postProduto(produto){
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/products/new`, produto, options).subscribe(data => {
      console.log(data);
    })
  }

}
