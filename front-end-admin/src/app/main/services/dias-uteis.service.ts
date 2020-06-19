import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DiasUteisService {

  constructor(private http: HttpClient) { }

  postDiasUteisMes(body) {
    return this.http.post('http://162.214.89.17:3000/production/dates/new', body);
  }

  getDiasUteisMes() {
    return this.http.get('http://162.214.89.17:3000/production/dates/all');
  }

}
