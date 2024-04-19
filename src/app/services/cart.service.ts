import { Injectable } from '@angular/core';
import {ProductService} from "./product.service";
@Injectable({
  providedIn: 'root'
})

export class CartService{
  //Dung map de luu tru gio hang
  private cart: Map<number, number> = new Map();

  constructor(private productService: ProductService) {
    //Lay du lieu gio hang tu localStorage khi khoi tao service

    this.refreshCart();
  }

  public  refreshCart(){
    const storedCart = localStorage.getItem(this.getCartKey());
    if (storedCart) {
      this.cart = new Map(JSON.parse(storedCart));
    } else {
      this.cart = new Map<number, number>();
    }
  }

  private getCartKey():string{
    const userResponseJSON = localStorage.getItem('user');
    const userResponse = JSON.parse(userResponseJSON!);
    debugger
    return `cart:${userResponse?.id ?? ''}`;
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
    localStorage.setItem(this.getCartKey(), JSON.stringify(Array.from(this.cart.entries())));
  }

  setCart(cart : Map<number, number>) {
    this.cart = cart ?? new Map<number, number>();
    this.saveCartToLocalStorage();
  }

  cleanCart(): void {
    this.cart.clear();
    this.saveCartToLocalStorage();
  }
}
