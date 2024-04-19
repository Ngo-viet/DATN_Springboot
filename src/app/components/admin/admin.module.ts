import {NgModule} from "@angular/core";
import {AdminComponent} from "./admin.component";
import {OrderAdminComponent} from "./order/order.admin.component";
import {DetailOrderAdminComponent} from "./detail-order/detail.order.admin.component";
import {ProductAdminComponent} from "./product/product.admin.component";
import {CategoryAdminComponent} from "./category/category.admin.component";
import {AdminRoutingModule} from "./admin-routing.module";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UpdateProductAdminComponent} from "./product/update/update.product.admin.component";
import {InsertProductAdminComponent} from "./product/insert/insert.product.admin.component";
import {UpdateCategoryAdminComponent} from "./category/update/update.category.admin.component";
import {InsertCategoryAdminComponent} from "./category/insert/insert.category.admin.component";
import {UserAdminComponent} from "./user/user.admin.component";


@NgModule({
  declarations: [
    AdminComponent,
    OrderAdminComponent,
    DetailOrderAdminComponent,
    ProductAdminComponent,
    CategoryAdminComponent,
    UpdateProductAdminComponent,
    InsertProductAdminComponent,
    UpdateCategoryAdminComponent,
    InsertCategoryAdminComponent,
    UserAdminComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    FormsModule

  ]
})
export class AdminModule{}
