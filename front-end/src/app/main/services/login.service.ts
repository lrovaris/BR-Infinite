import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import { Subject, throwError} from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router} from "@angular/router";
import { catchError, retry} from "rxjs/operators";
import { UrlService  } from "./utils/url.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router, private urlService: UrlService) { }

  url = this.urlService.getUrl();

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private user = {
    id: '',
    nome: '',
    email: '',
    informacaoProfissional :{
      sobre: '',
      infoAdicional: '',
      registro: {sigla: '', numeroRegistro: ''},
      ocupacao: '',
      dataEntrada: '',
      experiencia: [],
      tratarCondicoes: [],
      experienciaProfissional: [],
      formacao: [],
      linkedin: '',
      facebook: '',
      instagram: ''
    },
    isProfessional: false,
    mensagens: [],
    avaliacoes: [],
    tags: [],
    localidade: {estado:'', cidade:''}
  };
  id = '';



  cadastro(newUser) {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return this.http.post(`${this.url}users/new`, newUser, options).pipe(
      retry(2),
      catchError( (err: any) => {
        console.log(err.error.Message);
        alert(err.error.Message);
        return throwError(err);
      })
    ).subscribe(log => {
      alert('Usuario cadastrado com sucesso');
    })
  }

  log() {
    console.log('asd')
  }

  handleError(error: HttpErrorResponse) {
    console.log('pegou o erro');
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  updateCadastro(updatedUser) {

    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    console.log(updatedUser);
    return this.http.post(`${this.url}users/${updatedUser._id}/edit`, updatedUser, options).subscribe((log: any) => {
      this.user = log.ops[0];
    })
  }

  login(login: string, password: string) {

    const authData= {
      login: login,
      password: password
    };
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    this.http
      .post<{token: string, message: string}>(this.url+"/users/login",
        authData, options
      )
      .subscribe(response => {
        this.token = response.token;
        const helper = new JwtHelperService();
        this.user = helper.decodeToken(this.token);
        this.id = this.user.id;

        if(this.id.length > 0) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
        }
        if(this.isAuthenticated) {
          this.router.navigate(["home"]);
        }
      }, (error) =>{
        console.log(error);

        alert('Por favor, verifique seus dados de autenticação');
      });
    this.saveAuthData(this.token, new Date(Date.now()));
  }

  getUsers() {
    return this.http.get(`${this.url}/users/all`).pipe(
      retry(2),
      catchError( (err: any) => {
        console.log(err.error.message);
        alert(err.error.message);
        return throwError(err);
      })
    )
  }

  getToken() {
    return this.token;
  }

  getNome() {
    return this.user.nome;
  }

  getEmail() {
    return this.user.email;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUser() {
    return this.user;
  }


  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['']);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = this.token;
    const expirationDate = localStorage.getItem("expiration");
    if (!token) {
      return;
    }
    return {
      token: token
    }
  }

}
