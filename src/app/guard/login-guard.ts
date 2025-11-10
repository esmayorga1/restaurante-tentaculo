import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      take(1), // 🔹 toma solo el primer valor y completa la suscripción
      map((isLoggedIn) => {
        if (isLoggedIn) {
          console.log('✅ Usuario autenticado');
          return true;
        } else {
          console.warn('🚫 Usuario no autenticado, redirigiendo al login...');
          return this.router.createUrlTree(['']); // 🔹 redirige al login
        }
      })
    );
  }
}
