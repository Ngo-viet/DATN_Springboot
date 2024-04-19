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
import {AdminModule} from "./components/admin/admin.module";
import {ProductListComponent} from "./components/product_list/product-list.component";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";



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
    ProductListComponent

  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    NgbPopover,
    AdminModule,
    BrowserAnimationsModule

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
