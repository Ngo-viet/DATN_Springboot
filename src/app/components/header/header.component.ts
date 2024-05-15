import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserResponse} from "../../responses/user/user.response";

import { ActivatedRoute, Router } from '@angular/router';
import {TokenService} from "../../services/token.service";
import {Category} from "../../models/category";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  userResponse?:UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  selectedCategoryId: number = 0;
  categories: Category[] = [];
  keyword: string = '';

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private categoryService: CategoryService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.getCategories(1,100);
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    //alert(`Clicked on "${index}"`);
    if(index === 0) {
      console.log(index)
      this.router.navigate(['/user-profile']);
    }else if (index === 1) {
      const userId = this.tokenService.getUserId();
      this.router.navigate(['/orders', userId]);
    } else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
    }
    this.isPopoverOpen = false; // Close the popover after clicking an item
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

  onSearch(): void {
    this.router.navigate(['/product-list'], {
      queryParams: {
        keyword: this.keyword,
        categoryId: this.selectedCategoryId
      }
    });
  }
  setActiveNavItem(index: number) {
    this.activeNavItem = index;
    //alert(this.activeNavItem);
  }
}
