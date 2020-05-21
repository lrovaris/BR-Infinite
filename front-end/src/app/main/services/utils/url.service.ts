import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

   url = 'http://162.214.89.17:3000';

  public getUrl() {
     return this.url;
  }

  constructor() { }

}
