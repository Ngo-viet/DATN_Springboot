import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from "../models/product";
import {ProductService} from "./product.service";
import {LocalStorageService} from 'ngx-webstorage';
@Injectable({
  providedIn: 'root'
})

export class CartService{
  //Dung map de luu tru gio hang
  private cart: Map<number, number> = new Map();

  constructor(private productService: ProductService) {
    //Lay du lieu gio hang tu localStorage khi khoi tao service
    const storedCart = localStorage.getItem('cart');
    if(storedCart){
      this.cart = new Map(JSON.parse(storedCart));
    }
  }
  addToCart(productId: number, quantity: number = 1): void {
    debugger
    if(this.cart.has(productId)){
      //Neu san pham da co trong gio hang
      this.cart.set(productId, this.cart.get(productId)! + quantity);
    }else{
      this.cart.set(productId, quantity);
    }
    //Sau khi thay doi gio hang, luu tru no vao localStore
    this.saveCartToLocalStorage();
  }
  getCart(): Map<number, number>{
    return this.cart;
  }
  //Luu tru gio hang vao localStorage
  private saveCartToLocalStorage(): void{
    localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
  }

  cleanCart(): void {
    this.cart.clear();
    this.saveCartToLocalStorage();
  }
}
