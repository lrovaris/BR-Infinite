import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CorretoraService {

  url = 'http://162.214.89.17:3000'; // 162.214.89.17:3000/

  corretoraInfo: any;
  responsavel: any;
  isEdit = false;
  corretoraInfoWithOutFormGroup: any;

  saveCorretoraInfo(corretora) {
    this.corretoraInfo = corretora;
  }
  getCorretoraInfo() {
    return this.corretoraInfo;
  }

  getcorretoraInfoWithOutFormGroup() {
    return this.corretoraInfoWithOutFormGroup;
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

  editPostCorretora(id, corretora, responsavel){
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/corretoras/${id}/edit`, corretora, options).subscribe((data:any) => {
      alert(data.message);
      this.isEdit = false;
      this.getCorretora(id).subscribe((data: any) => {
        this.corretoraInfoWithOutFormGroup = data;
        this.router.navigate(['corretora/visualizacao'])
      });
    })
  }

  getAllCorretoras() {
    return this.http.get(`${this.url}/corretoras/all`);
  }

  getCorretora(id) {
    return this.http.get(`${this.url}/corretoras/${id}`)
  }

  editCorretora(corretora) {
    this.corretoraInfoWithOutFormGroup = corretora;
    this.isEdit = true;
    this.router.navigate(['corretora/visualizacao'])
  }



  constructor(private http: HttpClient, private router: Router) { }


}
