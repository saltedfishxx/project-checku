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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './web-pages/process-cheques/process-cheques.modules';
import { ToastrModule } from 'ngx-toastr';

import { TestPageComponent } from './web-pages/test-components/test-page/test-page.component';
import { ConfirmDialogComponent } from './common/components/confirm-dialog/confirm-dialog.component';
import { FluidModalComponent } from './common/components/fluid-modal/fluid-modal.component';
import { HamburgerDropdownComponent } from './common/components/hamburger-dropdown/hamburger-dropdown.component';
import { ReviewChequesComponent } from './web-pages/process-cheques/review-cheques/review-cheques.component';
import { RejectChequesComponent } from './web-pages/process-cheques/reject-cheques/reject-cheques.component';
import { SuccessChequesComponent } from './web-pages/process-cheques/success-cheques/success-cheques.component';
import { CardHeaderComponent } from './web-pages/process-cheques/card-header/card-header.component';
import { LoadingComponent } from './common/components/loading/loading.component';


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
    ConfirmDialogComponent,
    FluidModalComponent,
    HamburgerDropdownComponent,
    ReviewChequesComponent,
    RejectChequesComponent,
    SuccessChequesComponent,
    CardHeaderComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    ToastrModule.forRoot()
  ],
  exports: [
    LoginComponent,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
    ConfirmDialogComponent,
    BrowserAnimationsModule
  ],
  entryComponents: [ConfirmDialogComponent, FluidModalComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: APIInterceptor,
    multi: true,
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
