import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomePageComponent } from './main/pages/home-page/home-page.component';
import { LoginPageComponent } from './main/pages/login-page/login-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { CorretoraPageComponent } from './main/pages/corretora-page/corretora-page.component';
import { ColaboradorPageComponent } from './main/pages/colaborador-page/colaborador-page.component';
import { SeguradoraPageComponent } from './main/pages/seguradora-page/seguradora-page.component';
import { PipelinePageComponent } from './main/pages/pipeline-page/pipeline-page.component';
import { ProducaoPageComponent } from './main/pages/producao-page/producao-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    LoginPageComponent,
    CorretoraPageComponent,
    ColaboradorPageComponent,
    SeguradoraPageComponent,
    PipelinePageComponent,
    ProducaoPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
