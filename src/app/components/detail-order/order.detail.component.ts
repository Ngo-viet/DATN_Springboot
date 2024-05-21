import {Component, OnInit} from '@angular/core';
import {Product} from "../../models/product";
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";
import {environment} from "../../environments/environment";
import {OrderService} from "../../services/order.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiResponse} from "../../responses/api.response";
import {OrderDetail} from "../../models/order.detail";
import {OrderResponse} from "../../responses/order/order.response";
import {TokenService} from "../../services/token.service";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order.detail.component.html',
  styleUrl: './order.detail.component.css'
})
export class OrderDetailComponent implements OnInit{
  orderResponse: OrderResponse = {
    id: 0,
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: [] // Một mảng rỗng

  }
  orders: any[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private tokenService: TokenService
  ) {}
  ngOnInit():void {
    const userId = this.tokenService.getUserId();
    this.getOrdersByUserId(userId);
  }
  recipientInfoDisplayed: boolean = false;

  getOrdersByUserId(userId: number): void {
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          this.orders = response.map((order: any) => ({
            id: order.id,
            user_id: order.user.id,
            fullname: order.user.fullName,
            email: order.user.email,
            phone_number: order.user.phoneNumber,
            address: order.user.address,
            note: order.note,
            order_date: new Date(order.orderDate[0], order.orderDate[1] - 1, order.orderDate[2]),
            order_details: order.orderDetails.map((orderDetail: any) => ({
              ...orderDetail,
              total_money: orderDetail.price * orderDetail.numberOfProducts,
              product: {
                ...orderDetail.product,
                thumbnail: `${environment.apiBaseUrl}/products/images/${orderDetail.product.thumbnail}`
              },

            })),
            payment_method: order.paymentMethod,
            shipping_date: order.shippingDate ? new Date(order.shippingDate[0], order.shippingDate[1] - 1, order.shippingDate[2]) : null,
            shipping_method: order.shippingMethod,
            status: order.status,
            total_money: order.totalMoney
          }));
        } else {
          // Xử lý trường hợp response rỗng
          console.error('Empty or invalid response:', response);
        }
      },
      error: (error: any) => {
        console.error('Error fetching user orders:', error);
        // Thông báo lỗi cho người dùng hoặc xử lý lỗi khác tùy theo trường hợp
      }
    });
  }


  goToHomePage() {
    this.router.navigate(['/']);
    window.scrollTo(0, 0); 
  }



}
