import { Component, Inject, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../responses/api.response';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product.admin.component.html',
  styleUrls: [
    './product.admin.component.scss',
  ],

})
export class ProductAdminComponent implements OnInit {
  selectedCategoryId: number  = 0; // Giá trị category được chọn
  products: Product[] = [];
  // product?: Product;
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages:number = 0;
  visiblePages: number[] = [];
  keyword:string = "";
  localStorage?:Storage;
  currentImageIndex: number = 0;

  private productService = inject(ProductService);
  private router = inject(Router);
  private location = inject(Location);

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }
  ngOnInit() {
    this.currentPage = Number(this.localStorage?.getItem('currentProductAdminPage')) || 0;
    this.getProducts(this.keyword,
      this.selectedCategoryId,
      this.currentPage, this.itemsPerPage);
  }
  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    //Mediocre Iron Wallet
    debugger
    this.getProducts(this.keyword.trim(), this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    debugger
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        debugger
        response.products.forEach((product: Product) => {
          if (product && product.product_images && product.product_images.length > 0) {
            product.url = `${environment.apiBaseUrl}/products/images/${product.product_images[0].image_url}`;
          }
        });
        this.products = response.products;
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
    this.localStorage?.setItem('currentProductAdminPage', String(this.currentPage));
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getThumbnail(product: Product):void {
    // Kiểm tra xem sản phẩm có product_images không
    if (product && product.product_images && product.product_images.length > 0) {
       product.product_images[0].image_url; // Lấy URL của hình ảnh đầu tiên từ product_images
    }
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

  // Hàm xử lý sự kiện khi thêm mới sản phẩm
  insertProduct() {
    debugger
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/admin/products/insert']);
  }
  // showImage(index: number):void{
  //   debugger
  //   if(this.products && this.products. && product.product_images.length > 0){
  //     if(index < 0){
  //       index = 0;
  //     }else if(index >= this.products.product_images.length){
  //       index = this.products.product_images.length - 1;
  //     }
  //
  //     //Gan index hien tai va cap nhat anh hien tai
  //     this.currentImageIndex = index;
  //   }
  // }
  // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  updateProduct(productId: number) {
    debugger
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/admin/products/update', productId]);
  }

  deleteProduct(product: Product) {
    const confirmation = window
      .confirm('Are you sure you want to delete this product?');
    if (confirmation) {
      debugger
      this.productService.deleteProduct(product.id).subscribe({
        next: (response: any) => {
          debugger
          alert('Xóa thành công')
          location.reload();
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          alert(error.error)
          console.error('Error fetching products:', error);
        }
      });
    }
  }
}
