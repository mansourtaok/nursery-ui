import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { Auth } from './auth.model';

@Injectable()
export class AuthService {


  private isLogged : boolean = false ;

  constructor (
   private http: HttpClient,
   private router: Router,
   private _httpClient: HttpClient,

  ) {}


  login(auth):  Promise<any>
  {         
    return new Promise((resolve, reject) => {
      this._httpClient.post(environment.apiUrl + '/api/v1/nursery/auth/login' , {...auth}).subscribe(response => {            
           
        if(response == true){
          this.isLogged = true ;            
        }        

        resolve(response) ;   

        },error =>{
          this.isLogged = false ;     
        });      
      });
  }

  isLoggedIn(): boolean{
    return this.isLogged ;
}

logout(): void {
  this.router.navigate(['/auth/login']);
}


}