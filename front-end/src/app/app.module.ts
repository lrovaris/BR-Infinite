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
import { SeguradoraViewComponent } from './main/pages/seguradora-page/partials/seguradora-view/seguradora-view.component';
import { CorretoraViewComponent } from './main/pages/corretora-page/partials/corretora-view/corretora-view.component';
import { ProdutoViewComponent } from './main/pages/produtos-page/partials/produto-view/produto-view.component';
import { PipelineViewComponent } from './main/pages/pipeline-page/partials/pipeline-view/pipeline-view.component';
import { PipelineListComponent } from './main/pages/pipeline-page/partials/pipeline-list/pipeline-list.component';
import { ProducaoEnviarAnexoPartialComponent } from './main/pages/producao-page/partials/producao-enviar-anexo-partial/producao-enviar-anexo-partial.component';

// GRAFICOS -----------

import { NgxChartsModule } from '@swimlane/ngx-charts';
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import { ProducaoMensalPartialComponent } from './main/pages/producao-page/partials/producao-mensal-partial/producao-mensal-partial.component';
import { ProducaoSelectPartialComponent } from './main/pages/producao-page/partials/producao-select-partial/producao-select-partial.component';
import { ProducaoSelectCorretoraSeguradoraPartialComponent } from './main/pages/producao-page/partials/producao-select-corretora-seguradora-partial/producao-select-corretora-seguradora-partial.component';
import { ProducaoSelect2PartialComponent } from './main/pages/producao-page/partials/producao-select2-partial/producao-select2-partial.component';
import { ProducaoAnualPartialComponent } from './main/pages/producao-page/partials/producao-anual-partial/producao-anual-partial.component';
import { ProducaoCorretoraDiarioComponent } from './main/pages/producao-page/partials/producao-corretora-diario/producao-corretora-diario.component';
import { ProducaoCorretoraMensalComponent } from './main/pages/producao-page/partials/producao-corretora-mensal/producao-corretora-mensal.component';
import { ProducaoCorretoraAnualComponent } from './main/pages/producao-page/partials/producao-corretora-anual/producao-corretora-anual.component';

// END GRAFICOS -----------


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
    ListProdutosComponent,
    SeguradoraViewComponent,
    CorretoraViewComponent,
    ProdutoViewComponent,
    PipelineViewComponent,
    PipelineListComponent,
    ProducaoEnviarAnexoPartialComponent,
    ProducaoMensalPartialComponent,
    ProducaoSelectPartialComponent,
    ProducaoSelectCorretoraSeguradoraPartialComponent,
    ProducaoSelect2PartialComponent,
    ProducaoAnualPartialComponent,
    ProducaoCorretoraDiarioComponent,
    ProducaoCorretoraMensalComponent,
    ProducaoCorretoraAnualComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxChartsModule,
    NoopAnimationsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
