import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './web-pages/login/login.component';
import { TestPageComponent } from './web-pages/test-components/test-page/test-page.component';
import { ProcessChequesComponent } from './web-pages/process-cheques/process-cheques.component';
import { UploadChequesComponent } from './web-pages/upload-cheques/upload-cheques.component';
import { MainPageComponent } from './web-pages/main-page/main-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'test', component: TestPageComponent },
  { path: 'home', component: MainPageComponent },
  { path: 'upload', component: UploadChequesComponent },
  { path: 'process-cheques', component: ProcessChequesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
