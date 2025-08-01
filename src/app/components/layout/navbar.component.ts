import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
  template: `
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo et titre -->
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/dashboard" class="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
                <div class="hidden lg:block">
                  <h1 class="text-xl font-bold text-gray-900">Gestion Populations</h1>
                  <p class="text-xs text-gray-500">Commune du Plateau</p>
                </div>
              </a>
            </div>
          </div>

          <!-- Menu de navigation principal -->
          <div class="hidden md:flex items-center space-x-8">
            <a routerLink="/dashboard" 
               routerLinkActive="text-orange-600 border-orange-600" 
               class="border-b-2 border-transparent hover:border-orange-300 px-1 pt-1 pb-4 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                Tableau de bord
              </div>
            </a>

            <a routerLink="/familles" 
               routerLinkActive="text-orange-600 border-orange-600" 
               class="border-b-2 border-transparent hover:border-orange-300 px-1 pt-1 pb-4 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Familles
              </div>
            </a>

            <a routerLink="/quartiers" 
               routerLinkActive="text-orange-600 border-orange-600" 
               class="border-b-2 border-transparent hover:border-orange-300 px-1 pt-1 pb-4 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                Quartiers
              </div>
            </a>

            <a routerLink="/projets" 
               routerLinkActive="text-orange-600 border-orange-600" 
               class="border-b-2 border-transparent hover:border-orange-300 px-1 pt-1 pb-4 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clip-rule="evenodd"/>
                </svg>
                Projets
              </div>
            </a>

            <a routerLink="/statistiques" 
               routerLinkActive="text-orange-600 border-orange-600" 
               class="border-b-2 border-transparent hover:border-orange-300 px-1 pt-1 pb-4 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
                Statistiques
              </div>
            </a>
          </div>

          <!-- Menu utilisateur -->
          <div class="flex items-center space-x-4" *ngIf="currentUser">
            <!-- Notifications -->
            <button 
              routerLink="/notifications"
              class="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </button>

            <!-- Menu déroulant utilisateur -->
            <div class="relative" clickOutside (clickOutside)="closeUserMenu()">
              <button (click)="toggleUserMenu()" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">
                    {{ currentUser.firstName.charAt(0) }}{{ currentUser.lastName.charAt(0) }}
                  </span>
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium text-gray-900">{{ currentUser.firstName }} {{ currentUser.lastName }}</p>
                  <p class="text-xs text-gray-500 capitalize">{{ getRoleLabel(currentUser.role) }}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>

              <!-- Menu déroulant -->
              <div *ngIf="showUserMenu" class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div class="px-4 py-3 border-b border-gray-200">
                  <p class="text-sm font-medium text-gray-900">{{ currentUser.firstName }} {{ currentUser.lastName }}</p>
                  <p class="text-sm text-gray-500">{{ currentUser.email }}</p>
                </div>
                
                <a routerLink="/profil" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                    Mon profil
                  </div>
                </a>
                
                <a routerLink="/parametres" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                    </svg>
                    Paramètres
                  </div>
                </a>
                
                <div class="border-t border-gray-200 my-1"></div>
                
                <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/>
                    </svg>
                    Se déconnecter
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Menu mobile -->
          <div class="md:hidden flex items-center">
            <button (click)="toggleMobileMenu()" class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <svg *ngIf="!showMobileMenu" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg *ngIf="showMobileMenu" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Menu mobile -->
      <div *ngIf="showMobileMenu" class="md:hidden border-t border-gray-200 bg-gray-50">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a routerLink="/dashboard" 
             routerLinkActive="bg-orange-100 text-orange-700" 
             class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Tableau de bord
          </a>
          <a routerLink="/familles" 
             routerLinkActive="bg-orange-100 text-orange-700" 
             class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Familles
          </a>
          <a routerLink="/quartiers" 
             routerLinkActive="bg-orange-100 text-orange-700" 
             class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Quartiers
          </a>
          <a routerLink="/projets" 
             routerLinkActive="bg-orange-100 text-orange-700" 
             class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Projets
          </a>
          <a routerLink="/statistiques" 
             routerLinkActive="bg-orange-100 text-orange-700" 
             class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Statistiques
          </a>
          <a routerLink="/notifications" 
             routerLinkActive="bg-orange-100 text-orange-700" 
             class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Notifications
          </a>
          <a routerLink="/profil" 
             routerLinkActive="bg-orange-100 text-orange-700" 
             class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Profil
          </a>
          <a routerLink="/parametres" 
             routerLinkActive="bg-orange-100 text-orange-700" 
             class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Paramètres
          </a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  showUserMenu = false;
  showMobileMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'admin': 'Administrateur',
      'agent': 'Agent de terrain',
      'consultant': 'Consultant'
    };
    return labels[role] || role;
  }
}
