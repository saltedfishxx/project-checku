import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './web-pages/login/login.component';
import { TestPageComponent } from './web-pages/test-components/test-page/test-page.component';
import { ProcessChequesComponent } from './web-pages/process-cheques/process-cheques.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'test', component: TestPageComponent },
  { path: 'process-cheques', component: ProcessChequesComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
