import {  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class loginGuard  {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>((observer) => {
      this.authService.isLoggedIn().subscribe(loggedIn => {
        if (loggedIn) {
          observer.next(true);
          console.log("resgistrado")
        } else {
          console.log("No registarado")
          this.router.navigate(['']); 
          observer.next(false);
        }
      });
    });
  }
}
