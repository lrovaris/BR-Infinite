import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CorretoraService {

  url = 'http://localhost:3000'; // 162.214.89.17:3000/

  corretoraInfo: any;
  responsavel: any;

  saveCorretoraInfo(corretora) {
    this.corretoraInfo = corretora;
  }
  getCorretoraInfo() {
    return this.corretoraInfo;
  }

  postCorretora(corretora, responsavel){
    let manager = responsavel.value;
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/corretoras/new`, {corretora, manager}, options).subscribe((data:any) => {
alert(data.Message)
    })
  }

  getAllCorretoras() {
    return this.http.get(`${this.url}/corretoras/all`);
  }

  constructor(private http: HttpClient) { }


}
