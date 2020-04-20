import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from './main/pages/login-page/login-page.component';
import {CadastroPageComponent} from './main/pages/cadastro-page/cadastro-page.component';
import {UserListPageComponent} from './main/pages/user-list-page/user-list-page.component';


const routes: Routes = [
  { path: '', component: UserListPageComponent },
  { path: 'cadastro', component: CadastroPageComponent },
  { path: 'lista', component: UserListPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
