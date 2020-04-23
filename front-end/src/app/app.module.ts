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
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CorretoraCardSelectPartialComponent } from './main/pages/corretora-page/partials/corretora-card-select-partial/corretora-card-select-partial.component';
import { ProdutosPageComponent } from './main/pages/produtos-page/produtos-page.component';
import { SeguradoraCardPartialComponent } from './main/pages/seguradora-page/partials/seguradora-card-partial/seguradora-card-partial.component';
import { ListCorretoraComponent } from './main/pages/corretora-page/partials/list-corretora/list-corretora.component';
import { ListSeguradoraComponent } from './main/pages/seguradora-page/partials/list-seguradora/list-seguradora.component';
import { ListProdutosComponent } from './main/pages/produtos-page/partials/list-produtos/list-produtos.component';

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
    ProducaoPageComponent,
    CorretoraCardSelectPartialComponent,
    ProdutosPageComponent,
    SeguradoraCardPartialComponent,
    ListCorretoraComponent,
    ListSeguradoraComponent,
    ListProdutosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
