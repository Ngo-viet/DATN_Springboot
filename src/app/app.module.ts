import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HomeComponent } from './components/home/home.component';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {DetailProductComponent} from "./components/detail-product/detail-product.component";
import {OrderComponent} from "./components/order/order.component";
import {OrderDetailComponent} from "./components/detail-order/order.detail.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {TokenInterceptor} from "./interceptors/token.interceptor";
import { RouterModule } from '@angular/router';
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app/app.component";
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {UserProfileComponent} from "./components/user-profile/user.profile.component";
import {OrderAdminComponent} from "./components/admin/order/order.admin.component";
import {AdminComponent} from "./components/admin/admin.component";
import {ProductAdminComponent} from "./components/admin/product/product.admin.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DetailProductComponent,
    OrderComponent,
    OrderDetailComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    //ADMIN
    AdminComponent,
    OrderAdminComponent,
    ProductAdminComponent

  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    NgbPopover


  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
