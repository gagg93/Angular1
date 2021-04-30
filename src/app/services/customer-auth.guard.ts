import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CustomerAuthGuard implements CanActivate {
  constructor(public router: Router) {}

  canActivate(): boolean {
    if (sessionStorage.getItem('token') !== 'fake-jwt-token-customer' && sessionStorage.getItem('token') !== 'fake-jwt-token-admin') {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
