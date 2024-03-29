import {Inject, Injectable} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {LocalStorageService} from 'ngx-webstorage';
import {DOCUMENT} from "@angular/common";
@Injectable({
  providedIn: 'root'
})
export class TokenService{
   private readonly TOKEN_KEY = 'access_token';
  private jwtHelperService = new JwtHelperService();
  private localStorage? :LocalStorageService
  constructor() {

  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log(token, "Token");
  }
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getUserId(): number {
    let token = this.getToken();
    if (!token) {
      return 0;
    }
    let userObject = this.jwtHelperService.decodeToken(token);
    console.log(userObject, "Object")
    return 'userId' in userObject ? parseInt(userObject['userId']) : 0;
  }
  isTokenExpired(): boolean {
    if(this.getToken() == null) {
      return false;
    }

    return this.jwtHelperService.isTokenExpired(this.getToken()!);

  }
}
