import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginPageComponent } from './main/pages/login-page/login-page.component';
import { CadastroPageComponent } from './main/pages/cadastro-page/cadastro-page.component';
import { UserListPageComponent } from './main/pages/user-list-page/user-list-page.component';
import { Ng2SmartTableModule }  from "ng2-smart-table";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { ConfiguracaoPageComponent } from './main/pages/configuracao-page/configuracao-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginPageComponent,
    CadastroPageComponent,
    UserListPageComponent,
    ConfiguracaoPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Ng2SmartTableModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
