import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import {environment} from "../../environments/environment";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  product?: Product;
  categories: any[] = []; // Assuming you have category data
  keyword: string = '';
  selectedCategoryId: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 9;
  totalPages: number = 0;
  visiblePages: number[] = [];
  quantity: number = 1;
  isPressedAddToCart:boolean = false;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router) { }

  ngOnInit(): void {
    // this.searchProducts();
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';
      this.selectedCategoryId = +params['categoryId'] || 0;
      this.currentPage = +params['page'] || 0;
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    });
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        response.products.forEach((product: Product) => {
          if (product && product.product_images && product.product_images.length > 0) {
            product.url = `${environment.apiBaseUrl}/products/images/${product.product_images[0].image_url}`;
          }
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  searchProducts() {
    this.currentPage = 1;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  onSearch(): void {
    this.router.navigate(['/product-list'], {
      queryParams: {
        keyword: this.keyword,
        categoryId: this.selectedCategoryId
      }
    });
  }
  onProductClick(productId: number){
    debugger
    this.router.navigate(['/products', productId]);
  }

  addToCart(): void{
    debugger
    this.isPressedAddToCart = true;
    if(this.product){
      this.cartService.addToCart(this.product.id, this.quantity);
    }else{
      // xu ly khi product la null
      console.error('Khong the them san pham vao gio hang vi product null');
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

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  buyNow(){
    if(this.isPressedAddToCart == false) {
      this.addToCart();
    }
    this.router.navigate(['/orders']);
  }
}
