import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FamilleService } from '../../services/famille.service';
import { QuartierService } from '../../services/quartier.service';
import { ProjetService } from '../../services/projet.service';
import { StatistiqueService } from '../../services/statistique-simple.service';

@Component({
  selector: 'app-dashboard-improved',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- En-tête -->
      <div class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
              <p class="mt-1 text-sm text-gray-600">Vue d'ensemble de la gestion des populations</p>
            </div>
            <div class="flex space-x-3">
              <button
                (click)="refreshData()"
                [disabled]="loading"
                class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center">
                <svg [class]="loading ? 'animate-spin w-4 h-4 mr-2' : 'w-4 h-4 mr-2'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ loading ? 'Actualisation...' : 'Actualiser' }}
              </button>
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Statistiques principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Population totale -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Population totale</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ formatNumber(stats.population) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <span class="text-green-600 font-medium">+5.2%</span>
                <span class="text-gray-500"> depuis l'année dernière</span>
              </div>
            </div>
          </div>

          <!-- Familles -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Familles</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ formatNumber(stats.familles) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <span class="text-green-600 font-medium">+3.8%</span>
                <span class="text-gray-500"> croissance mensuelle</span>
              </div>
            </div>
          </div>

          <!-- Quartiers -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Quartiers</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.quartiers }}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <span class="text-blue-600 font-medium">{{ stats.quartiersActifs }}</span>
                <span class="text-gray-500"> actifs</span>
              </div>
            </div>
          </div>

          <!-- Projets -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Projets actifs</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.projetsActifs }}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <span class="text-orange-600 font-medium">{{ stats.budgetUtilise }}%</span>
                <span class="text-gray-500"> budget utilisé</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Graphiques et données détaillées -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Répartition par quartier -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Répartition des familles par quartier
              </h3>
              <div class="space-y-3">
                @for (quartier of repartitionQuartiers; track quartier.nom) {
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div [class]="'w-3 h-3 rounded-full mr-3 ' + quartier.color"></div>
                      <span class="text-sm font-medium text-gray-900">{{ quartier.nom }}</span>
                    </div>
                    <div class="flex items-center">
                      <span class="text-sm text-gray-500 mr-2">{{ quartier.familles }}</span>
                      <div class="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          [class]="'h-2 rounded-full ' + quartier.color"
                          [style.width.%]="quartier.pourcentage">
                        </div>
                      </div>
                      <span class="text-xs text-gray-500 ml-2">{{ quartier.pourcentage }}%</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Projets par statut -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                État des projets
              </h3>
              <div class="space-y-3">
                @for (statut of projetsStatuts; track statut.nom) {
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div [class]="'w-3 h-3 rounded-full mr-3 ' + statut.color"></div>
                      <span class="text-sm font-medium text-gray-900">{{ statut.nom }}</span>
                    </div>
                    <div class="flex items-center">
                      <span class="text-sm text-gray-500 mr-2">{{ statut.nombre }}</span>
                      <div class="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          [class]="'h-2 rounded-full ' + statut.color"
                          [style.width.%]="statut.pourcentage">
                        </div>
                      </div>
                      <span class="text-xs text-gray-500 ml-2">{{ statut.pourcentage }}%</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Gestion des familles -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Gestion des Familles
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Ajouter, modifier ou consulter les informations des familles
              </p>
              <div class="space-y-3">
                <button 
                  routerLink="/familles/new"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Nouvelle famille
                </button>
                <button 
                  routerLink="/familles"
                  class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
                  Voir toutes les familles
                </button>
              </div>
            </div>
          </div>

          <!-- Gestion des quartiers -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Gestion des Quartiers
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Gérer les informations et statistiques des quartiers
              </p>
              <div class="space-y-3">
                <button 
                  routerLink="/quartiers/new"
                  class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Nouveau quartier
                </button>
                <button 
                  routerLink="/quartiers"
                  class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
                  Voir tous les quartiers
                </button>
              </div>
            </div>
          </div>

          <!-- Gestion des projets -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Gestion des Projets
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Suivre et gérer les projets municipaux
              </p>
              <div class="space-y-3">
                <button 
                  routerLink="/projets/new"
                  class="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Nouveau projet
                </button>
                <button 
                  routerLink="/projets"
                  class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
                  Voir tous les projets
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Alertes et notifications -->
        @if (alertes && alertes.length > 0) {
          <div class="bg-white shadow rounded-lg mb-8">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
                </svg>
                Alertes et notifications
              </h3>
              <div class="space-y-3">
                @for (alerte of alertes; track alerte.id) {
                  <div [class]="'p-3 rounded-md border-l-4 ' + alerte.class">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg [class]="'w-5 h-5 ' + alerte.iconClass" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p [class]="'text-sm font-medium ' + alerte.textClass">{{ alerte.titre }}</p>
                        <p [class]="'text-sm ' + alerte.descClass">{{ alerte.description }}</p>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- Activités récentes -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Activités récentes
            </h3>
            <div class="flow-root">
              <ul class="-mb-8">
                @for (activite of activitesRecentes; track activite.id; let isLast = $last) {
                  <li>
                    <div class="relative pb-8">
                      @if (!isLast) {
                        <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                      }
                      <div class="relative flex space-x-3">
                        <div>
                          <span [class]="'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ' + activite.bgColor">
                            <svg [class]="'w-5 h-5 ' + activite.iconColor" fill="currentColor" viewBox="0 0 20 20">
                              <path [innerHTML]="activite.iconPath"></path>
                            </svg>
                          </span>
                        </div>
                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p class="text-sm text-gray-500">{{ activite.description }}</p>
                          </div>
                          <div class="text-right text-sm whitespace-nowrap text-gray-500">
                            {{ activite.date | date:'short' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1400px;
    }
  `]
})
export class DashboardImprovedComponent implements OnInit {
  loading = false;
  
  stats = {
    population: 45500,
    familles: 10800,
    quartiers: 12,
    quartiersActifs: 10,
    projetsActifs: 8,
    budgetUtilise: 65
  };

  repartitionQuartiers = [
    { nom: 'Pateau Nord', familles: 3500, pourcentage: 32, color: 'bg-blue-500' },
    { nom: 'Plateau', familles: 2100, pourcentage: 19, color: 'bg-green-500' },
    { nom: 'Pateau Centre', familles: 5200, pourcentage: 49, color: 'bg-purple-500' }
  ];

  projetsStatuts = [
    { nom: 'En cours', nombre: 8, pourcentage: 50, color: 'bg-green-500' },
    { nom: 'Planifiés', nombre: 5, pourcentage: 31, color: 'bg-blue-500' },
    { nom: 'Terminés', nombre: 3, pourcentage: 19, color: 'bg-gray-500' }
  ];

  alertes = [
    {
      id: 1,
      titre: 'Projet en retard',
      description: 'Le projet de rénovation du marché central accuse un retard de 2 semaines.',
      class: 'bg-red-50 border-red-400',
      textClass: 'text-red-800',
      descClass: 'text-red-700',
      iconClass: 'text-red-400'
    },
    {
      id: 2,
      titre: 'Validation en attente',
      description: '25 familles sont en attente de validation dans le système.',
      class: 'bg-yellow-50 border-yellow-400',
      textClass: 'text-yellow-800',
      descClass: 'text-yellow-700',
      iconClass: 'text-yellow-400'
    }
  ];

  activitesRecentes = [
    {
      id: 1,
      description: 'Nouvelle famille KOUAME ajoutée dans le quartier Pateau Nord',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      bgColor: 'bg-blue-500',
      iconColor: 'text-white',
      iconPath: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z'
    },
    {
      id: 2,
      description: 'Projet d\'assainissement Pateau Centre mis à jour - avancement 75%',
      date: new Date(Date.now() - 4 * 60 * 60 * 1000),
      bgColor: 'bg-green-500',
      iconColor: 'text-white',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      id: 3,
      description: 'Rapport mensuel généré pour le quartier Plateau',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000),
      bgColor: 'bg-purple-500',
      iconColor: 'text-white',
      iconPath: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2v1a1 1 0 001 1h1a1 1 0 001-1V3a2 2 0 012 2v6.586l1.707 1.707a1 1 0 01-1.414 1.414L10 13.414V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6.586l1.707 1.707a1 1 0 01-1.414 1.414L4 13.414V5z'
    }
  ];

  constructor(
    private familleService: FamilleService,
    private quartierService: QuartierService,
    private projetService: ProjetService,
    private statistiqueService: StatistiqueService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Simuler le chargement des données
    setTimeout(() => {
      this.loadFamilleStats();
      this.loadQuartierStats();
      this.loadProjetStats();
      this.loading = false;
    }, 1000);
  }

  loadFamilleStats() {
    this.familleService.getStatistiquesFamilles().subscribe({
      next: (stats) => {
        this.stats.familles = stats.totalFamilles;
        this.stats.population = stats.totalMembres;
      },
      error: (error) => console.error('Erreur lors du chargement des stats familles:', error)
    });
  }

  loadQuartierStats() {
    this.quartierService.quartiers$.subscribe({
      next: (quartiers) => {
        this.stats.quartiers = quartiers.length;
        this.stats.quartiersActifs = quartiers.filter(q => q.createdAt).length;
      },
      error: (error) => console.error('Erreur lors du chargement des stats quartiers:', error)
    });
  }

  loadProjetStats() {
    this.projetService.projets$.subscribe({
      next: (projets) => {
        this.stats.projetsActifs = projets.filter(p => p.statut === 'en-cours').length;
        // Calculer le pourcentage du budget utilisé
        const budgetTotal = projets.reduce((sum, p) => sum + (p.budget || 0), 0);
        const budgetDepense = projets.reduce((sum, p) => sum + (p.budgetDepense || 0), 0);
        this.stats.budgetUtilise = budgetTotal > 0 ? Math.round((budgetDepense / budgetTotal) * 100) : 0;
      },
      error: (error) => console.error('Erreur lors du chargement des stats projets:', error)
    });
  }

  refreshData() {
    this.loadDashboardData();
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }
}
