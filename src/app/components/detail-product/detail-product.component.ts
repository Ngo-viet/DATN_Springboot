import {Component, OnInit} from '@angular/core';
import {Product} from "../../models/product";
import {ProductService} from "../../services/product.service";
import {environment} from "../../environments/environment";
import {ProductImage} from "../../models/product.image";
import {CartService} from "../../services/cart.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart:boolean = false;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ){}
  ngOnInit(){
    //Lay productId tu Url
    //
    debugger

    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam !== null){
      this.productId = +idParam;
    }
    if(!isNaN(this.productId)){
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) =>{
          //Lay danh sach san pham vaf thay doi url
          if(response.product_images && response.product_images.length > 0){
            response.product_images?.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }
          debugger
          this.product = response
          //Bat dau voi anh dau tien
          this.showImage(1);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) =>{
          debugger;
          console.error('Error fetching detail:', error);
        }
      });
    }else{
      console.log('Invalid productId: ', idParam);
    }
  }
  showImage(index: number):void{
    debugger
    if(this.product && this.product.product_images && this.product.product_images.length > 0){
      if(index < 0){
        index = 0;
      }else if(index >= this.product.product_images.length){
        index = this.product.product_images.length - 1;
      }

      //Gan index hien tai va cap nhat anh hien tai
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number){
    debugger
    //Goi khi mot thmbnail duoc bam
    this.currentImageIndex = index;
  }
  nextImage(): void{
    debugger
    this.showImage(this.currentImageIndex + 1);
  }
  previousImage(): void{
    debugger
    this.showImage(this.currentImageIndex - 1);
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

  increateQuantity(): void{
    this.quantity++;
  }
  decreaseQuantity(): void{
    if(this.quantity > 1){
      this.quantity--;
    }
  }

  getTotalPrice(): number {
    if (this.product){
      return this.product.price * this.quantity;
    }
    return 0;
  }
  buyNow(){
    if(this.isPressedAddToCart == false) {
      this.addToCart();
    }
    this.router.navigate(['/orders']);
  }
}
