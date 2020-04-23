import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CorretoraService {

  url = 'http://localhost:3000';


  corretoraInfo: any;
  responsavel: any;


  saveCorretoraInfo(corretora) {
    this.corretoraInfo = corretora;
  }
  getCorretoraInfo() {
    return this.corretoraInfo;
  }

  postCorretora(corretora, responsavel){
    console.log(corretora);
    console.log(responsavel.value);
    let manager = responsavel.value;
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/corretoras/new`, {corretora, manager}, options).subscribe(data => {
      console.log(data);
    })
  }


  constructor(private http: HttpClient) { }


}
