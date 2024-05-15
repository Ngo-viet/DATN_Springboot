import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from "../models/product";
import {UpdateProductDTO} from "../dtos/product/update.product.dto";
import {InsertProductDTO} from "../dtos/product/insert.product.dto";
import { ApiResponse } from '../responses/api.response';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiBaseUrl = environment.apiBaseUrl;
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
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products`, { params });
  }





  getDetailProduct(productId: number):Observable<Product>{
    return this.http.get<Product>(`${environment.apiBaseUrl}/products/${productId}`);
  }
  getProductsByIds(productIds: number[]): Observable<Product[]> {
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products/by-ids`, { params });
  }
  deleteProduct(productId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiBaseUrl}/products/${productId}`);
  }
  updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<UpdateProductDTO> {
    return this.http.put<Product>(`${this.apiBaseUrl}/products/${productId}`, updatedProduct);
  }
  insertProduct(insertProductDTO: InsertProductDTO): Observable<any> {
    // Add a new product
    return this.http.post(`${this.apiBaseUrl}/products`, insertProductDTO);
  }
  uploadImages(productId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    return this.http.post(`${this.apiBaseUrl}/products/uploads/${productId}`, formData);
  }
  deleteProductImage(id: number): Observable<any> {
    return this.http.delete<string>(`${this.apiBaseUrl}/product_images/${id}`);
  }

  getNewestProducts(limit: number = 5): Observable<Product[]> { // Thêm tham số limit và mặc định là 5
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products/newest?limit=${limit}`);
  }

}
