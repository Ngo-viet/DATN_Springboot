import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiGetProducts  = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }


  getProducts(keyword:string, categoryId:number,
                   page: number, limit: number
  ): Observable<Product[]> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('category_id', categoryId)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Product[]>(this.apiGetProducts, { params });
  }





  getDetailProduct(productId: number){
    return this.http.get(`${environment.apiBaseUrl}/products/${productId}`);
  }
  getProductsByIds(productIds: number[]): Observable<Product[]>{
    //Chuyen danh sach ID thanh mot chuoi va truyen vao params
    debugger
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`,{ params });
  }

  // deleteProduct(productId: number): Observable<ApiResponse> {
  //   debugger
  //   return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/products/${productId}`);
  // }
  // updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<ApiResponse> {
  //   return this.http.put<ApiResponse>(`${this.apiBaseUrl}/products/${productId}`, updatedProduct);
  // }
  // insertProduct(insertProductDTO: InsertProductDTO): Observable<ApiResponse> {
  //   // Add a new product
  //   return this.http.post<ApiResponse>(`${this.apiBaseUrl}/products`, insertProductDTO);
  // }
  // uploadImages(productId: number, files: File[]): Observable<ApiResponse> {
  //   const formData = new FormData();
  //   for (let i = 0; i < files.length; i++) {
  //     formData.append('files', files[i]);
  //   }
  //   // Upload images for the specified product id
  //   return this.http.post<ApiResponse>(`${this.apiBaseUrl}/products/uploads/${productId}`, formData);
  // }
  // deleteProductImage(id: number): Observable<any> {
  //   debugger
  //   return this.http.delete<string>(`${this.apiBaseUrl}/product_images/${id}`);
  // }

}
