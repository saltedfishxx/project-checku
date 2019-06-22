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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APIInterceptor } from './common/services/APIInterceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'angular-bootstrap-md';

import { TestPageComponent } from './web-pages/test-components/test-page/test-page.component';
import { ConfirmDialogComponent } from './common/confirm-dialog/confirm-dialog.component';
 

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
    TestPageComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot()
  ],
  exports: [
    LoginComponent,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
    ConfirmDialogComponent
  ],
  entryComponents: [ConfirmDialogComponent],    
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: APIInterceptor,
    multi: true,
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
