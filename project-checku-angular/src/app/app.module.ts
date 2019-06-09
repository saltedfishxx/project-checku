import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './web-pages/login/login.component';
import { DatatableComponent } from './common/components/table-common/datatable/datatable.component';
import { DatatableCheckboxButtonComponent } from './common/components/table-common/datatable-checkbox-button/datatable-checkbox-button.component';
import { MainPageComponent } from './web-pages/main-page/main-page.component';
import { UploadChequesComponent } from './web-pages/upload-cheques/upload-cheques.component';
import { ProcessChequesComponent } from './web-pages/process-cheques/process-cheques.component';
import { SideBarComponent } from './common/components/side-bar/side-bar.component';
import { ImageCheckboxComponent } from './common/components/image-checkbox/image-checkbox.component';
import { DialogComponent } from './common/components/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DatatableComponent,
    DatatableCheckboxButtonComponent,
    MainPageComponent,
    UploadChequesComponent,
    ProcessChequesComponent,
    SideBarComponent,
    ImageCheckboxComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  exports: [
    LoginComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
