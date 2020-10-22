import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthService } from './login/auth.service';

@Injectable()
export class AuthenticationGuardService implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  /**
   * Check if the user is logged in before calling http
   *
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isLogged()) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}
