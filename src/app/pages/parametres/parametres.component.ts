import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface SystemSettings {
  applicationName: string;
  version: string;
  maintenanceMode: boolean;
  maxUsersPerRole: {
    admin: number;
    superviseur: number;
    agent: number;
  };
  dataRetention: {
    families: number; // en mois
    projects: number; // en mois
    reports: number; // en mois
  };
  backupSettings: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number; // nombre de sauvegardes à conserver
  };
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    username: string;
    useSSL: boolean;
    fromEmail: string;
  };
  securitySettings: {
    passwordMinLength: number;
    sessionTimeout: number; // en minutes
    maxLoginAttempts: number;
    requireTwoFactor: boolean;
  };
}

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6 max-w-6xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Paramètres Système</h1>
        <p class="text-gray-600">Configuration générale de l'application</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Menu de navigation -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-4">
            <nav class="space-y-2">
              <button
                *ngFor="let section of sections; trackBy: trackBySection"
                (click)="activeSection = section.id"
                [class]="getSectionClass(section.id)"
                class="w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <i [class]="section.icon" class="mr-3"></i>
                {{ section.label }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Contenu des sections -->
        <div class="lg:col-span-3">
          <!-- Section Général -->
          @if (activeSection === 'general') {
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Paramètres généraux</h2>
              <form [formGroup]="generalForm" (ngSubmit)="saveGeneralSettings()">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'application</label>
                    <input 
                      formControlName="applicationName"
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Version</label>
                    <input 
                      formControlName="version"
                      type="text" 
                      readonly
                      class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  </div>
                  <div class="flex items-center">
                    <input 
                      formControlName="maintenanceMode"
                      type="checkbox" 
                      class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                    <label class="ml-2 block text-sm text-gray-900">Mode maintenance</label>
                  </div>
                </div>
                <div class="mt-6">
                  <button 
                    type="submit"
                    class="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- Section Utilisateurs -->
          @if (activeSection === 'users') {
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Gestion des utilisateurs</h2>
              <form [formGroup]="usersForm" (ngSubmit)="saveUsersSettings()">
                <div class="space-y-6">
                  <div>
                    <h3 class="text-md font-medium text-gray-900 mb-3">Nombre maximum d'utilisateurs par rôle</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Administrateurs</label>
                        <input 
                          formControlName="maxAdmin"
                          type="number" 
                          min="1"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Superviseurs</label>
                        <input 
                          formControlName="maxSuperviseur"
                          type="number" 
                          min="1"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Agents</label>
                        <input 
                          formControlName="maxAgent"
                          type="number" 
                          min="1"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-6">
                  <button 
                    type="submit"
                    class="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- Section Sécurité -->
          @if (activeSection === 'security') {
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Paramètres de sécurité</h2>
              <form [formGroup]="securityForm" (ngSubmit)="saveSecuritySettings()">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Longueur minimale du mot de passe</label>
                    <input 
                      formControlName="passwordMinLength"
                      type="number" 
                      min="6" 
                      max="20"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Timeout de session (minutes)</label>
                    <input 
                      formControlName="sessionTimeout"
                      type="number" 
                      min="15" 
                      max="480"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre max de tentatives de connexion</label>
                    <input 
                      formControlName="maxLoginAttempts"
                      type="number" 
                      min="3" 
                      max="10"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div class="flex items-center">
                    <input 
                      formControlName="requireTwoFactor"
                      type="checkbox" 
                      class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                    <label class="ml-2 block text-sm text-gray-900">Exiger l'authentification à deux facteurs</label>
                  </div>
                </div>
                <div class="mt-6">
                  <button 
                    type="submit"
                    class="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- Section Email -->
          @if (activeSection === 'email') {
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Configuration Email</h2>
              <form [formGroup]="emailForm" (ngSubmit)="saveEmailSettings()">
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Serveur SMTP</label>
                      <input 
                        formControlName="smtpHost"
                        type="text" 
                        placeholder="smtp.example.com"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Port SMTP</label>
                      <input 
                        formControlName="smtpPort"
                        type="number" 
                        placeholder="587"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                    <input 
                      formControlName="username"
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email expéditeur</label>
                    <input 
                      formControlName="fromEmail"
                      type="email" 
                      placeholder="noreply@gestion-pop.ci"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div class="flex items-center">
                    <input 
                      formControlName="useSSL"
                      type="checkbox" 
                      class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                    <label class="ml-2 block text-sm text-gray-900">Utiliser SSL/TLS</label>
                  </div>
                </div>
                <div class="mt-6 space-x-3">
                  <button 
                    type="submit"
                    class="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                    Sauvegarder
                  </button>
                  <button 
                    type="button"
                    (click)="testEmailSettings()"
                    class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Tester la configuration
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- Section Sauvegarde -->
          @if (activeSection === 'backup') {
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Sauvegarde et récupération</h2>
              <form [formGroup]="backupForm" (ngSubmit)="saveBackupSettings()">
                <div class="space-y-4">
                  <div class="flex items-center">
                    <input 
                      formControlName="enabled"
                      type="checkbox" 
                      class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                    <label class="ml-2 block text-sm text-gray-900">Activer les sauvegardes automatiques</label>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fréquence de sauvegarde</label>
                    <select 
                      formControlName="frequency"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="daily">Quotidienne</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuelle</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de sauvegardes à conserver</label>
                    <input 
                      formControlName="retention"
                      type="number" 
                      min="1" 
                      max="30"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                </div>
                <div class="mt-6 space-x-3">
                  <button 
                    type="submit"
                    class="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                    Sauvegarder
                  </button>
                  <button 
                    type="button"
                    (click)="createBackup()"
                    class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Créer une sauvegarde maintenant
                  </button>
                </div>
              </form>

              <!-- Liste des sauvegardes récentes -->
              <div class="mt-8">
                <h3 class="text-md font-medium text-gray-900 mb-3">Sauvegardes récentes</h3>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      @for (backup of recentBackups; track backup.id) {
                        <tr>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ backup.date | date:'dd/MM/yyyy à HH:mm' }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ backup.size }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span [class]="getBackupStatusClass(backup.status)">
                              {{ backup.status }}
                            </span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button class="text-blue-600 hover:text-blue-900 mr-3">Télécharger</button>
                            <button class="text-red-600 hover:text-red-900">Supprimer</button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

          <!-- Section Données -->
          @if (activeSection === 'data') {
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Gestion des données</h2>
              <form [formGroup]="dataForm" (ngSubmit)="saveDataSettings()">
                <div class="space-y-6">
                  <div>
                    <h3 class="text-md font-medium text-gray-900 mb-3">Rétention des données (en mois)</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Familles</label>
                        <input 
                          formControlName="familiesRetention"
                          type="number" 
                          min="12"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Projets</label>
                        <input 
                          formControlName="projectsRetention"
                          type="number" 
                          min="12"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Rapports</label>
                        <input 
                          formControlName="reportsRetention"
                          type="number" 
                          min="6"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-6 space-x-3">
                  <button 
                    type="submit"
                    class="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                    Sauvegarder
                  </button>
                  <button 
                    type="button"
                    (click)="cleanupOldData()"
                    class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    Nettoyer les anciennes données
                  </button>
                </div>
              </form>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ParametresComponent implements OnInit {
  activeSection = 'general';
  
  generalForm!: FormGroup;
  usersForm!: FormGroup;
  securityForm!: FormGroup;
  emailForm!: FormGroup;
  backupForm!: FormGroup;
  dataForm!: FormGroup;

  sections = [
    { id: 'general', label: 'Général', icon: 'fas fa-cog' },
    { id: 'users', label: 'Utilisateurs', icon: 'fas fa-users' },
    { id: 'security', label: 'Sécurité', icon: 'fas fa-shield-alt' },
    { id: 'email', label: 'Email', icon: 'fas fa-envelope' },
    { id: 'backup', label: 'Sauvegarde', icon: 'fas fa-database' },
    { id: 'data', label: 'Données', icon: 'fas fa-chart-bar' }
  ];

  recentBackups = [
    {
      id: '1',
      date: new Date('2025-01-31T10:30:00'),
      size: '45.2 MB',
      status: 'Réussie'
    },
    {
      id: '2',
      date: new Date('2025-01-30T10:30:00'),
      size: '44.8 MB',
      status: 'Réussie'
    },
    {
      id: '3',
      date: new Date('2025-01-29T10:30:00'),
      size: '44.1 MB',
      status: 'Échouée'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadSettings();
  }

  private initializeForms() {
    this.generalForm = this.fb.group({
      applicationName: ['Gestion des Populations', Validators.required],
      version: ['1.0.0'],
      maintenanceMode: [false]
    });

    this.usersForm = this.fb.group({
      maxAdmin: [5, [Validators.required, Validators.min(1)]],
      maxSuperviseur: [20, [Validators.required, Validators.min(1)]],
      maxAgent: [100, [Validators.required, Validators.min(1)]]
    });

    this.securityForm = this.fb.group({
      passwordMinLength: [8, [Validators.required, Validators.min(6)]],
      sessionTimeout: [120, [Validators.required, Validators.min(15)]],
      maxLoginAttempts: [5, [Validators.required, Validators.min(3)]],
      requireTwoFactor: [false]
    });

    this.emailForm = this.fb.group({
      smtpHost: ['smtp.gmail.com', Validators.required],
      smtpPort: [587, [Validators.required, Validators.min(1)]],
      username: ['', Validators.required],
      fromEmail: ['noreply@gestion-pop.ci', [Validators.required, Validators.email]],
      useSSL: [true]
    });

    this.backupForm = this.fb.group({
      enabled: [true],
      frequency: ['daily', Validators.required],
      retention: [7, [Validators.required, Validators.min(1)]]
    });

    this.dataForm = this.fb.group({
      familiesRetention: [60, [Validators.required, Validators.min(12)]],
      projectsRetention: [36, [Validators.required, Validators.min(12)]],
      reportsRetention: [12, [Validators.required, Validators.min(6)]]
    });
  }

  loadSettings() {
    // Charger les paramètres depuis le service
    // Pour l'instant, on utilise des valeurs par défaut
  }

  getSectionClass(sectionId: string): string {
    return this.activeSection === sectionId
      ? 'bg-orange-100 text-orange-700 border-orange-300'
      : 'text-gray-600 hover:bg-gray-100';
  }

  getBackupStatusClass(status: string): string {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'Réussie':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'Échouée':
        return `${baseClass} bg-red-100 text-red-800`;
      case 'En cours':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  trackBySection(index: number, section: any): string {
    return section.id;
  }

  saveGeneralSettings() {
    if (this.generalForm.valid) {
      console.log('Paramètres généraux sauvegardés:', this.generalForm.value);
      alert('Paramètres généraux sauvegardés avec succès !');
    }
  }

  saveUsersSettings() {
    if (this.usersForm.valid) {
      console.log('Paramètres utilisateurs sauvegardés:', this.usersForm.value);
      alert('Paramètres utilisateurs sauvegardés avec succès !');
    }
  }

  saveSecuritySettings() {
    if (this.securityForm.valid) {
      console.log('Paramètres de sécurité sauvegardés:', this.securityForm.value);
      alert('Paramètres de sécurité sauvegardés avec succès !');
    }
  }

  saveEmailSettings() {
    if (this.emailForm.valid) {
      console.log('Paramètres email sauvegardés:', this.emailForm.value);
      alert('Paramètres email sauvegardés avec succès !');
    }
  }

  saveBackupSettings() {
    if (this.backupForm.valid) {
      console.log('Paramètres de sauvegarde sauvegardés:', this.backupForm.value);
      alert('Paramètres de sauvegarde sauvegardés avec succès !');
    }
  }

  saveDataSettings() {
    if (this.dataForm.valid) {
      console.log('Paramètres de données sauvegardés:', this.dataForm.value);
      alert('Paramètres de données sauvegardés avec succès !');
    }
  }

  testEmailSettings() {
    if (this.emailForm.valid) {
      alert('Test de configuration email en cours...');
      // Simulation du test
      setTimeout(() => {
        alert('Configuration email testée avec succès !');
      }, 2000);
    }
  }

  createBackup() {
    alert('Création de sauvegarde en cours...');
    // Simulation de la création de sauvegarde
    setTimeout(() => {
      alert('Sauvegarde créée avec succès !');
      // Ajouter la nouvelle sauvegarde à la liste
      this.recentBackups.unshift({
        id: Date.now().toString(),
        date: new Date(),
        size: '45.5 MB',
        status: 'Réussie'
      });
    }, 3000);
  }

  cleanupOldData() {
    if (confirm('Êtes-vous sûr de vouloir nettoyer les anciennes données ? Cette action est irréversible.')) {
      alert('Nettoyage des anciennes données en cours...');
      setTimeout(() => {
        alert('Nettoyage terminé avec succès !');
      }, 2000);
    }
  }
}
