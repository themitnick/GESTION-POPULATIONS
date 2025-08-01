import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface DemoAccount {
  username: string;
  password: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  demoAccounts: DemoAccount[] = [
    {
      username: 'admin',
      password: 'admin123',
      label: 'Administrateur',
      description: 'Accès complet au système'
    },
    {
      username: 'agent1',
      password: 'agent123',
      label: 'Agent Municipal',
      description: 'Saisie et consultation des données'
    },
    {
      username: 'consultant',
      password: 'consultant123',
      label: 'Consultant',
      description: 'Consultation uniquement'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    const loginRequest = {
      username: this.credentials.username,
      password: this.credentials.password
    };

    this.authService.login(loginRequest)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          // Si on arrive ici, la connexion a réussi
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Une erreur est survenue lors de la connexion';
          console.error('Erreur de connexion:', error);
        }
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  selectDemoAccount(account: DemoAccount) {
    this.credentials.username = account.username;
    this.credentials.password = account.password;
    this.errorMessage = '';
  }
}
