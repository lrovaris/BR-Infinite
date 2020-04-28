import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './main/pages/home-page/home-page.component';
import { LoginPageComponent } from "./main/pages/login-page/login-page.component";
import { CorretoraPageComponent } from "./main/pages/corretora-page/corretora-page.component";
import { SeguradoraPageComponent } from "./main/pages/seguradora-page/seguradora-page.component";
import { PipelinePageComponent } from "./main/pages/pipeline-page/pipeline-page.component";
import { ColaboradorPageComponent } from "./main/pages/colaborador-page/colaborador-page.component";
import { ProducaoPageComponent } from "./main/pages/producao-page/producao-page.component";
import { ProdutosPageComponent } from "./main/pages/produtos-page/produtos-page.component";
import { ListSeguradoraComponent } from "./main/pages/seguradora-page/partials/list-seguradora/list-seguradora.component";
import { ListCorretoraComponent } from "./main/pages/corretora-page/partials/list-corretora/list-corretora.component";
import { ListProdutosComponent } from "./main/pages/produtos-page/partials/list-produtos/list-produtos.component";


// TODO O Projeto está estruturado em divisão por páginas


const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'corretora', component: ListCorretoraComponent },
  { path: 'corretora/cadastro', component: CorretoraPageComponent },
  { path: 'seguradora', component: ListSeguradoraComponent },
  { path: 'seguradora/cadastro', component: SeguradoraPageComponent },
  { path: 'seguradora/visualizacao', component: SeguradoraPageComponent },
  { path: 'pipeline', component: PipelinePageComponent },
  { path: 'produtos', component: ListProdutosComponent },
  { path: 'produtos/cadastro', component: ProdutosPageComponent },
  { path: 'colaborador', component: ColaboradorPageComponent },
  { path: 'producao', component: ProducaoPageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
