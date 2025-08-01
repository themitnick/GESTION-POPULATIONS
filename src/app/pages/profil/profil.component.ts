import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur } from '../../models/utilisateur.model';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6 max-w-4xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p class="text-gray-600">Gérez vos informations personnelles et préférences</p>
      </div>

      @if (currentUser) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Section Avatar et informations de base -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="text-center">
                <div class="relative inline-block">
                  <img 
                    [src]="currentUser.avatar || 'https://via.placeholder.com/150'" 
                    alt="Avatar"
                    class="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200">
                  <button 
                    (click)="triggerFileInput()"
                    class="absolute bottom-0 right-0 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 shadow-lg">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                  <input 
                    #fileInput 
                    type="file" 
                    accept="image/*" 
                    (change)="onFileSelected($event)"
                    class="hidden">
                </div>
                <h2 class="mt-4 text-xl font-semibold text-gray-900">{{ currentUser.nom }} {{ currentUser.prenoms }}</h2>
                <p class="text-gray-600">{{ currentUser.email }}</p>
                <div class="mt-2">
                  <span [class]="getRoleClass(currentUser.role)">
                    {{ currentUser.role }}
                  </span>
                </div>
              </div>

              <div class="mt-6 space-y-4">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">Statut</span>
                  <span [class]="getStatutClass(currentUser.statut)">
                    {{ currentUser.statut }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">Membre depuis</span>
                  <span class="text-sm text-gray-900">{{ currentUser.dateCreation | date:'dd/MM/yyyy' }}</span>
                </div>
                @if (currentUser.derniereConnexion) {
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Dernière connexion</span>
                    <span class="text-sm text-gray-900">{{ currentUser.derniereConnexion | date:'dd/MM/yyyy à HH:mm' }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Section Formulaires -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Informations personnelles -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input 
                      formControlName="nom"
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prénoms *</label>
                    <input 
                      formControlName="prenoms"
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      formControlName="email"
                      type="email" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input 
                      formControlName="telephone"
                      type="tel" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                </div>
                <div class="mt-6 flex justify-end">
                  <button 
                    type="submit"
                    [disabled]="profileForm.invalid || updating"
                    class="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">
                    {{ updating ? 'Mise à jour...' : 'Mettre à jour' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Changer le mot de passe -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Changer le mot de passe</h3>
              <form [formGroup]="passwordForm" (ngSubmit)="updatePassword()">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel *</label>
                    <input 
                      formControlName="currentPassword"
                      type="password" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe *</label>
                    <input 
                      formControlName="newPassword"
                      type="password" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe *</label>
                    <input 
                      formControlName="confirmPassword"
                      type="password" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                </div>
                @if (passwordForm.get('confirmPassword')?.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Les mots de passe ne correspondent pas</p>
                }
                <div class="mt-6 flex justify-end">
                  <button 
                    type="submit"
                    [disabled]="passwordForm.invalid || updatingPassword"
                    class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
                    {{ updatingPassword ? 'Modification...' : 'Changer le mot de passe' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Préférences -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Préférences</h3>
              <form [formGroup]="preferencesForm" (ngSubmit)="updatePreferences()">
                <div class="space-y-6">
                  <!-- Langue -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                    <select 
                      formControlName="langue"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <!-- Thème -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                    <select 
                      formControlName="theme"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                    </select>
                  </div>

                  <!-- Notifications -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">Notifications</label>
                    <div class="space-y-3">
                      <div class="flex items-center">
                        <input 
                          formControlName="notificationEmail"
                          type="checkbox" 
                          class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                        <label class="ml-2 block text-sm text-gray-900">Notifications par email</label>
                      </div>
                      <div class="flex items-center">
                        <input 
                          formControlName="notificationPush"
                          type="checkbox" 
                          class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                        <label class="ml-2 block text-sm text-gray-900">Notifications push</label>
                      </div>
                      <div class="flex items-center">
                        <input 
                          formControlName="notificationSms"
                          type="checkbox" 
                          class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                        <label class="ml-2 block text-sm text-gray-900">Notifications SMS</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button 
                    type="submit"
                    [disabled]="updatingPreferences"
                    class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                    {{ updatingPreferences ? 'Sauvegarde...' : 'Sauvegarder les préférences' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Chargement du profil...</p>
        </div>
      }
    </div>
  `
})
export class ProfilComponent implements OnInit {
  currentUser: Utilisateur | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  preferencesForm: FormGroup;
  
  updating = false;
  updatingPassword = false;
  updatingPreferences = false;

  constructor(
    private utilisateurService: UtilisateurService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenoms: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.preferencesForm = this.fb.group({
      langue: ['fr'],
      theme: ['light'],
      notificationEmail: [true],
      notificationPush: [true],
      notificationSms: [false]
    });
  }

  ngOnInit() {
    this.utilisateurService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          nom: user.nom,
          prenoms: user.prenoms,
          email: user.email,
          telephone: user.telephone
        });

        this.preferencesForm.patchValue({
          langue: user.preferences.langue,
          theme: user.preferences.theme,
          notificationEmail: user.preferences.notifications.email,
          notificationPush: user.preferences.notifications.push,
          notificationSms: user.preferences.notifications.sms
        });
      }
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.updating = true;
      const formData = this.profileForm.value;
      
      this.utilisateurService.updateProfile(formData).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.updating = false;
          alert('Profil mis à jour avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.updating = false;
          alert('Erreur lors de la mise à jour du profil');
        }
      });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      this.updatingPassword = true;
      const { currentPassword, newPassword } = this.passwordForm.value;
      
      this.utilisateurService.updatePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.updatingPassword = false;
          this.passwordForm.reset();
          alert('Mot de passe modifié avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors du changement de mot de passe:', error);
          this.updatingPassword = false;
          alert('Erreur lors du changement de mot de passe');
        }
      });
    }
  }

  updatePreferences() {
    if (this.preferencesForm.valid) {
      this.updatingPreferences = true;
      const formData = this.preferencesForm.value;
      
      const preferences = {
        langue: formData.langue,
        theme: formData.theme,
        notifications: {
          email: formData.notificationEmail,
          push: formData.notificationPush,
          sms: formData.notificationSms
        }
      };

      this.utilisateurService.updatePreferences(preferences).subscribe({
        next: () => {
          this.updatingPreferences = false;
          alert('Préférences sauvegardées avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde:', error);
          this.updatingPreferences = false;
          alert('Erreur lors de la sauvegarde des préférences');
        }
      });
    }
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.utilisateurService.uploadAvatar(file).subscribe({
        next: (avatarUrl) => {
          if (this.currentUser) {
            this.utilisateurService.updateProfile({ avatar: avatarUrl }).subscribe();
          }
        },
        error: (error) => {
          console.error('Erreur lors de l\'upload:', error);
          alert('Erreur lors de l\'upload de l\'avatar');
        }
      });
    }
  }

  getRoleClass(role: string): string {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (role) {
      case 'Admin':
        return `${baseClass} bg-red-100 text-red-800`;
      case 'Superviseur':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'Agent':
        return `${baseClass} bg-green-100 text-green-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  getStatutClass(statut: string): string {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    return statut === 'Actif' 
      ? `${baseClass} bg-green-100 text-green-800`
      : `${baseClass} bg-red-100 text-red-800`;
  }

  private passwordMatchValidator(group: any) {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
    
    if (newPassword?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }
}
