import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';
import {LocalStorageService} from "ngx-webstorage";
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderService } from '../../../services/order.service';
import { CommonModule,DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../responses/api.response';
import {ToastrService} from "ngx-toastr";
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order.admin.component.html',
  styleUrls: ['./order.admin.component.scss'],

})
export class OrderAdminComponent implements OnInit{
  orders: OrderResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages:number = 0;
  keyword:string = "";
  visiblePages: number[] = [];
  localStorage?:LocalStorageService;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService
  ) {
    // this.localStorage = document.defaultView?.localStorage;
  }
  ngOnInit(): void {
    debugger
    this.currentPage = Number(localStorage.getItem('currentOrderAdminPage')) || 1;
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }
  searchOrders() {
    this.currentPage = 1;
    this.itemsPerPage = 5;
    //Mediocre Iron Wallet
    debugger
    this.getAllOrders(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }
  getAllOrders(keyword: string, page: number, limit: number) {
    debugger
    this.orderService.getAllOrders(keyword, page, limit).subscribe({
      next: (response: any) => {
        debugger
        this.orders = response.orders;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
      }
    });
  }
  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    localStorage.setItem('currentOrderAdminPage', String(this.currentPage));
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }

  deleteOrder(id: number) {
    const confirmation = window
      .confirm('Bạn chắc chắn muôn xóa đơn hàng này ?');
    if (confirmation) {
      debugger
      this.orderService.deleteOrder(id).subscribe({
        next: (response: any) => {
          debugger
          this.toastr.success("Xóa đơn hàng thành công", "Thành công", {
            timeOut: 2000
          });
          location.reload();
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          this.toastr.error("Xóa đơn hàng thất bại", "Thất bại", {
            timeOut: 2000
          });
        }
      });
    }
  }
  viewDetails(order:OrderResponse) {
    debugger
    this.router.navigate(['/admin/orders', order.id]);
  }


  generateExcel() {
    this.reportService.generateExcel().subscribe(
      (data: Blob) => {
        this.downloadFile(data);
      },
      error => {
        console.error('Error downloading the Excel file:', error);
        // Xử lý lỗi nếu có
      }
    );
  }

  private downloadFile(data: Blob) {
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.xls';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  }


}
