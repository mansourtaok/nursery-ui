import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;    
  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  constructor (
   private http: HttpClient,
   private router: Router
  ) {}

  login(username, password) {
    
    if(username == 'mark.tawk@gmail.com' && password == '123'){
      this.isLoggedIn = true ;
    }
    this.redirectUrl = '/ui/stocks' ;
    this.router.navigate([this.redirectUrl]);
  }

  logout(): void {
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }

  isLogged(): boolean{
    return this.isLoggedIn ;
  }
}