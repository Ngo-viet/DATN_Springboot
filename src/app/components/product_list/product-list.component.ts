import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import {environment} from "../../environments/environment";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {CartService} from "../../services/cart.service";
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  product?: Product;
  keyword: string = '';
  selectedCategoryId: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;
  visiblePages: number[] = [];
  quantity: number = 1;
  isPressedAddToCart:boolean = false;
  categories: Category[] = []; 
  newestProducts: Product[] = [];
  productId: number = 0;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private categoryService: CategoryService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCategories(0, 10);
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.productId = +idParam;
    }
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';
      this.selectedCategoryId = +params['categoryId'] || 0;
      this.currentPage = +params['page'] || 1;
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    });
    if (this.newestProducts.length === 0) {
      this.getNewestProducts();
    }
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

  onCategoryChange() {
    this.searchProducts();
  }
  onCategoryChangeId(categoryId: number) {
    this.selectedCategoryId = categoryId;
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
    window.scrollTo(0, 0); 
  }

  addToCart(product: Product): void{
    this.isPressedAddToCart = true;
    if(product){
      this.cartService.addToCart(product.id, this.quantity);
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

  buyNow(product: Product){
    if(this.isPressedAddToCart == false) {
      this.addToCart(product);
    }
    this.router.navigate(['/orders']);
    window.scrollTo(0, 0); 
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  getNewestProducts(): void {
    this.productService.getNewestProducts(5).subscribe(
        products => {
            products.forEach((product: Product) => {
                product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
            });
            this.products = products;
            this.newestProducts = products;
        },
        error => {
            console.error('Error fetching newest products:', error);
        }
    );
}
}
