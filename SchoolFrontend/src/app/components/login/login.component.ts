import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Pour le moment, simulons une connexion réussie pour tester
    // En production, vous utiliserez l'API réelle
    setTimeout(() => {
      this.isLoading = false;
      
      // Simulation d'une réponse de connexion réussie
      const mockResponse = {
        success: true,
        user: {
          id: 1,
          name: 'Administrateur',
          email: this.credentials.email,
          role: 'admin'
        },
        token: 'mock-jwt-token'
      };

      // Stocker les données utilisateur
      localStorage.setItem('currentUser', JSON.stringify(mockResponse.user));
      localStorage.setItem('token', mockResponse.token);

      // Redirection vers le tableau de bord admin
      this.router.navigate(['/admin']);
    }, 1500); // Simulation d'un délai de connexion

    // Code pour l'API réelle (à décommenter quand l'API est prête)
    /*
    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Redirection selon le rôle de l'utilisateur
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.errorMessage = response.message || 'Erreur de connexion';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur de connexion:', error);
        this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
      }
    });
    */
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearError() {
    this.errorMessage = '';
  }
} 