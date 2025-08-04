import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Vérifier si l'utilisateur a le rôle admin
    if (!this.authService.isAdmin()) {
      // Rediriger vers la page appropriée selon le rôle
      const user = this.authService.currentUserValue;
      if (user) {
        switch (user.role?.toLowerCase()) {
          case 'enseignant':
            this.router.navigate(['/enseignants']);
            break;
          case 'parent':
            this.router.navigate(['/parents']);
            break;
          case 'eleve':
            this.router.navigate(['/eleves']);
            break;
          default:
            this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }

    return true;
  }
} 