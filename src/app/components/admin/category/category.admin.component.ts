import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../environments/environment";
@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrls: [
    './category.admin.component.scss',
  ]
})
export class CategoryAdminComponent implements OnInit {
  categories: Category[] = []; // Dữ liệu động từ categoryService
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getCategories(0, 100);
  }
  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        categories.forEach((categorie: Category) => {
          categorie.url = `${environment.apiBaseUrl}/products/images/${categorie.thumbnail}`;
        });
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
  insertCategory() {
    debugger
    // Điều hướng đến trang detail-category với categoryId là tham số
    this.router.navigate(['/admin/categories/insert']);
  }

  // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  updateCategory(categoryId: number) {
    debugger
    this.router.navigate(['/admin/categories/update', categoryId.toString()]);
  }
  deleteCategory(category: Category) {
    const confirmation = window
      .confirm('Bạn chắc chắn muốn xóa danh mục?');
    if (confirmation) {
      debugger
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response: any) => {
          debugger
          this.toastr.success("Xóa danh mục thành công", "Thành công", {
            timeOut: 2000
          });
          location.reload();
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          this.toastr.error("Xoá  danh mục thất bại", "Thất bại", {
            timeOut: 2000
          });
        }
      });
    }
  }
}
