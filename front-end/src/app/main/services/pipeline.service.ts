import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  url = 'http://162.214.89.17:3000';
  oportundiade: any;
  isEdit = false;

  getAllOportunidades() {
    return this.http.get(`${this.url}/opportunities/all`);
  }

  setOportunidade(oportunidade) {
    this.oportundiade = oportunidade;
  }
  getOportunidadeWIthOutForm() {
    return this.oportundiade;
  }
  setIsEditTrue() {
    this.isEdit = true;
  }
  setIsEditFalse() {
    this.isEdit = false;
  }
  getIsEdit() {
    return this.isEdit;
  }

  postOportunidade(oportunidade) {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/opportunities/new`, oportunidade, options).subscribe((data:any) => {
      alert(data.message)
    })
  }

  editPostOportunidade(id, oportunidade) {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}/opportunities/${id}/edit`, oportunidade, options).subscribe((data:any) => {
      alert(data.message);
      this.isEdit = false;
      this.getOportunidade(id).subscribe((data: any) => {
        this.oportundiade = data;
        this.router.navigate(['pipeline/visualizacao'])
      });
    })
  }

  getOportunidade(id) {
    return this.http.get(`${this.url}/opportunities/${id}`)
  }


  constructor(private http: HttpClient, private router: Router) { }
}
