import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar.component';
import { FooterComponent } from './components/layout/footer.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Navigation (affichée seulement si l'utilisateur est connecté et pas sur login) -->
      <app-navbar *ngIf="isAuthenticated && !isLoginPage"></app-navbar>
      
      <!-- Contenu principal -->
      <main [class]="isAuthenticated && !isLoginPage ? 'flex-1' : 'min-h-screen'">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer (affiché seulement si connecté et pas sur login) -->
      <app-footer *ngIf="isAuthenticated && !isLoginPage"></app-footer>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'gestion-populations';
  isAuthenticated = false;
  isLoginPage = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Écouter les changements d'état d'authentification
    this.authService.isAuthenticated$.subscribe(
      isAuth => {
        this.isAuthenticated = isAuth;
        
        // Rediriger vers le dashboard si connecté et sur la page de login
        if (isAuth && this.router.url === '/login') {
          this.router.navigate(['/dashboard']);
        }
        
        // Rediriger vers login si non connecté et pas déjà sur login
        if (!isAuth && this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    );

    // Écouter les changements de route pour détecter la page de login
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLoginPage = event.url === '/login' || event.url === '/';
      });
  }
}
