import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjetService } from '../../services/projet.service';

@Component({
  selector: 'app-projet-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <!-- En-tête -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestion des Projets</h1>
          <p class="text-gray-600">Gérer les projets municipaux</p>
        </div>
        <button
          (click)="openCreateModal()"
          class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Nouveau Projet
        </button>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom du projet</label>
            <input
              type="text"
              [(ngModel)]="searchCriteria.nom"
              (ngModelChange)="onSearch()"
              placeholder="Rechercher..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
            <select
              [(ngModel)]="searchCriteria.quartier"
              (ngModelChange)="onSearch()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Tous les quartiers</option>
              <option value="Pateau Nord">Pateau Nord</option>
              <option value="Plateau">Plateau</option>
              <option value="Pateau Centre">Pateau Centre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              [(ngModel)]="searchCriteria.type"
              (ngModelChange)="onSearch()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Tous les types</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="social">Social</option>
              <option value="economique">Économique</option>
              <option value="environnemental">Environnemental</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              [(ngModel)]="searchCriteria.statut"
              (ngModelChange)="onSearch()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Tous les statuts</option>
              <option value="planifie">Planifié</option>
              <option value="en-cours">En cours</option>
              <option value="termine">Terminé</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              (click)="resetSearch()"
              class="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Projets</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistiques.total || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">En Cours</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistiques.enCours || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Budget Total</p>
              <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(statistiques.budgetTotal || 0) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Bénéficiaires</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistiques.beneficiaires || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des projets -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        @if (loading) {
          <div class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Chargement...</p>
          </div>
        } @else if (filteredProjets.length === 0) {
          <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun projet trouvé</h3>
            <p class="mt-1 text-sm text-gray-500">Commencez par ajouter un nouveau projet.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            @for (projet of filteredProjets; track projet.id) {
              <div class="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <!-- En-tête du projet -->
                <div class="p-4 border-b border-gray-200">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ projet.nom }}</h3>
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span class="flex items-center">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                          {{ projet.quartier }}
                        </span>
                        <span [class]="getTypeClass(projet.type)">
                          {{ getTypeLabel(projet.type) }}
                        </span>
                      </div>
                    </div>
                    <span [class]="getStatutClass(projet.statut)">
                      {{ getStatutLabel(projet.statut) }}
                    </span>
                  </div>
                </div>

                <!-- Contenu du projet -->
                <div class="p-4">
                  <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ projet.description }}</p>
                  
                  <!-- Informations financières -->
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div class="text-xs text-gray-500">Budget total</div>
                      <div class="text-sm font-semibold text-green-600">{{ formatCurrency(projet.budget) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500">Dépensé</div>
                      <div class="text-sm font-semibold text-orange-600">{{ formatCurrency(projet.budgetDepense) }}</div>
                    </div>
                  </div>

                  <!-- Barre de progression -->
                  <div class="mb-4">
                    <div class="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progression</span>
                      <span>{{ getAvancement(projet) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        [style.width.%]="getAvancement(projet)">
                      </div>
                    </div>
                  </div>

                  <!-- Informations temporelles -->
                  <div class="grid grid-cols-2 gap-4 mb-4 text-xs">
                    <div>
                      <span class="text-gray-500">Début:</span>
                      <span class="ml-1 text-gray-900">{{ projet.dateDebut | date:'dd/MM/yyyy' }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Fin prévue:</span>
                      <span class="ml-1 text-gray-900">{{ projet.dateFinPrevue | date:'dd/MM/yyyy' }}</span>
                    </div>
                  </div>

                  <!-- Responsable et bénéficiaires -->
                  <div class="text-xs text-gray-600 mb-4">
                    <div class="mb-1">
                      <span class="font-medium">Responsable:</span> {{ projet.responsable }}
                    </div>
                    <div>
                      <span class="font-medium">Bénéficiaires:</span> {{ projet.beneficiaires }} personnes
                    </div>
                  </div>

                  <!-- Indicateurs si disponibles -->
                  @if (projet.indicateurs && projet.indicateurs.length > 0) {
                    <div class="mb-4">
                      <div class="text-xs font-medium text-gray-700 mb-2">Indicateurs clés</div>
                      <div class="space-y-1">
                        @for (indicateur of projet.indicateurs.slice(0, 2); track indicateur.id) {
                          <div class="flex justify-between text-xs">
                            <span class="text-gray-600">{{ indicateur.nom }}</span>
                            <span class="text-gray-900">
                              {{ indicateur.valeurActuelle }}/{{ indicateur.valeurCible }} {{ indicateur.unite }}
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>

                <!-- Actions -->
                <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    (click)="viewProjet(projet)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Voir détails
                  </button>
                  <div class="space-x-2">
                    <button
                      (click)="editProjet(projet)"
                      class="text-orange-600 hover:text-orange-800 text-sm font-medium">
                      Modifier
                    </button>
                    <button
                      (click)="deleteProjet(projet)"
                      class="text-red-600 hover:text-red-800 text-sm font-medium">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Modal de création/modification -->
      @if (showModal) {
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ editingProjet ? 'Modifier le projet' : 'Nouveau projet' }}
              </h3>
              <button
                (click)="closeModal()"
                class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <form [formGroup]="projetForm" (ngSubmit)="saveProjet()" class="space-y-6">
              <!-- Informations de base -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nom du projet *</label>
                  <input
                    type="text"
                    formControlName="nom"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Quartier *</label>
                  <select
                    formControlName="quartier"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">Sélectionner un quartier</option>
                    <option value="Pateau Nord">Pateau Nord</option>
                    <option value="Plateau">Plateau</option>
                    <option value="Pateau Centre">Pateau Centre</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    formControlName="type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">Sélectionner un type</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="social">Social</option>
                    <option value="economique">Économique</option>
                    <option value="environnemental">Environnemental</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  formControlName="description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
              </div>

              <!-- Informations financières et temporelles -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Budget (FCFA) *</label>
                  <input
                    type="number"
                    formControlName="budget"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Responsable *</label>
                  <input
                    type="text"
                    formControlName="responsable"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
                  <input
                    type="date"
                    formControlName="dateDebut"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date de fin prévue *</label>
                  <input
                    type="date"
                    formControlName="dateFinPrevue"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Annuler
                </button>
                <button
                  type="submit"
                  [disabled]="!projetForm.valid || saving"
                  class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">
                  {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 1400px;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProjetListComponent implements OnInit {
  projets: any[] = [];
  filteredProjets: any[] = [];
  loading = false;
  showModal = false;
  editingProjet: any = null;
  saving = false;

  statistiques = {
    total: 0,
    enCours: 0,
    budgetTotal: 0,
    beneficiaires: 0
  };

  searchCriteria = {
    nom: '',
    quartier: '',
    type: '',
    statut: ''
  };

  projetForm: FormGroup;

  constructor(
    private projetService: ProjetService,
    private fb: FormBuilder
  ) {
    this.projetForm = this.fb.group({
      nom: ['', [Validators.required]],
      description: ['', [Validators.required]],
      quartier: ['', [Validators.required]],
      type: ['', [Validators.required]],
      budget: [0, [Validators.required, Validators.min(0)]],
      responsable: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFinPrevue: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadProjets();
    this.loadStatistiques();
  }

  loadProjets() {
    this.loading = true;
    this.projetService.projets$.subscribe({
      next: (projets) => {
        this.projets = projets;
        this.filteredProjets = projets;
        this.loading = false;
        this.updateStatistiques();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets:', error);
        this.loading = false;
      }
    });
  }

  loadStatistiques() {
    // Simuler le chargement des statistiques
    setTimeout(() => {
      this.updateStatistiques();
    }, 500);
  }

  updateStatistiques() {
    this.statistiques = {
      total: this.projets.length,
      enCours: this.projets.filter(p => p.statut === 'en-cours').length,
      budgetTotal: this.projets.reduce((sum, p) => sum + (p.budget || 0), 0),
      beneficiaires: this.projets.reduce((sum, p) => sum + (p.beneficiaires || 0), 0)
    };
  }

  onSearch() {
    this.filteredProjets = this.projets.filter(projet => {
      let matches = true;
      
      if (this.searchCriteria.nom) {
        matches = matches && projet.nom.toLowerCase().includes(this.searchCriteria.nom.toLowerCase());
      }
      
      if (this.searchCriteria.quartier) {
        matches = matches && projet.quartier === this.searchCriteria.quartier;
      }
      
      if (this.searchCriteria.type) {
        matches = matches && projet.type === this.searchCriteria.type;
      }
      
      if (this.searchCriteria.statut) {
        matches = matches && projet.statut === this.searchCriteria.statut;
      }
      
      return matches;
    });
  }

  resetSearch() {
    this.searchCriteria = { nom: '', quartier: '', type: '', statut: '' };
    this.filteredProjets = this.projets;
  }

  openCreateModal() {
    this.editingProjet = null;
    this.projetForm.reset();
    this.showModal = true;
  }

  editProjet(projet: any) {
    this.editingProjet = projet;
    this.projetForm.patchValue({
      nom: projet.nom,
      description: projet.description,
      quartier: projet.quartier,
      type: projet.type,
      budget: projet.budget,
      responsable: projet.responsable,
      dateDebut: this.formatDate(projet.dateDebut),
      dateFinPrevue: this.formatDate(projet.dateFinPrevue)
    });
    this.showModal = true;
  }

  viewProjet(projet: any) {
    console.log('Voir projet:', projet);
    // Implémenter la navigation vers le détail
  }

  deleteProjet(projet: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${projet.nom}" ?`)) {
      this.projetService.supprimerProjet(projet.id).subscribe({
        next: () => {
          this.loadProjets();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du projet');
        }
      });
    }
  }

  saveProjet() {
    if (this.projetForm.valid) {
      this.saving = true;
      const formData = this.projetForm.value;
      
      const projetData = {
        ...formData,
        quartierId: this.getQuartierIdByName(formData.quartier),
        statut: this.editingProjet?.statut || 'planifie',
        budgetDepense: this.editingProjet?.budgetDepense || 0,
        beneficiaires: this.editingProjet?.beneficiaires || 0,
        dateDebut: new Date(formData.dateDebut),
        dateFinPrevue: new Date(formData.dateFinPrevue)
      };

      const operation = this.editingProjet 
        ? this.projetService.modifierProjet(this.editingProjet.id, projetData)
        : this.projetService.ajouterProjet(projetData);

      operation.subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          this.loadProjets();
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde:', error);
          this.saving = false;
          alert('Erreur lors de la sauvegarde');
        }
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingProjet = null;
    this.projetForm.reset();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  getAvancement(projet: any): number {
    if (projet.indicateurs && projet.indicateurs.length > 0) {
      const pourcentages = projet.indicateurs.map((i: any) => i.pourcentageRealisation || 0);
      return Math.round(pourcentages.reduce((sum: number, p: number) => sum + p, 0) / pourcentages.length);
    }
    return Math.floor(Math.random() * 100); // Valeur simulée
  }

  getStatutClass(statut: string): string {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (statut) {
      case 'planifie':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'en-cours':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'termine':
        return `${baseClass} bg-gray-100 text-gray-800`;
      case 'suspendu':
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  getTypeClass(type: string): string {
    const baseClass = 'inline-flex items-center px-2 py-1 rounded text-xs font-medium';
    switch (type) {
      case 'infrastructure':
        return `${baseClass} bg-orange-100 text-orange-800`;
      case 'social':
        return `${baseClass} bg-purple-100 text-purple-800`;
      case 'economique':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'environnemental':
        return `${baseClass} bg-blue-100 text-blue-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'planifie': 'Planifié',
      'en-cours': 'En cours',
      'termine': 'Terminé',
      'suspendu': 'Suspendu'
    };
    return labels[statut] || statut;
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'infrastructure': 'Infrastructure',
      'social': 'Social',
      'economique': 'Économique',
      'environnemental': 'Environnemental'
    };
    return labels[type] || type;
  }

  private getQuartierIdByName(nom: string): string {
    const quartierMap: { [key: string]: string } = {
      'Pateau Nord': '1',
      'Plateau': '2',
      'Pateau Centre': '3'
    };
    return quartierMap[nom] || '1';
  }
}
