import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuartierService } from '../../services/quartier.service';
import { Quartier } from '../../models/quartier.model';

@Component({
  selector: 'app-quartier-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <!-- En-tête -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestion des Quartiers</h1>
          <p class="text-gray-600">Gérer les quartiers et leurs informations</p>
        </div>
        <button
          (click)="openCreateModal()"
          class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Nouveau Quartier
        </button>
      </div>

      <!-- Filtres de recherche -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom du quartier</label>
            <input
              type="text"
              [(ngModel)]="searchCriteria.nom"
              (ngModelChange)="onSearch()"
              placeholder="Rechercher par nom..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input
              type="text"
              [(ngModel)]="searchCriteria.code"
              (ngModelChange)="onSearch()"
              placeholder="Code du quartier..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
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

      <!-- Liste des quartiers -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @if (loading) {
          <div class="col-span-full flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span class="ml-2 text-gray-600">Chargement...</span>
          </div>
        } @else if (filteredQuartiers.length === 0) {
          <div class="col-span-full text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun quartier trouvé</h3>
            <p class="mt-1 text-sm text-gray-500">Commencez par ajouter un nouveau quartier.</p>
          </div>
        } @else {
          @for (quartier of filteredQuartiers; track quartier.id) {
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <!-- En-tête de carte -->
              <div class="p-4 border-b border-gray-200">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ quartier.nom }}</h3>
                    <p class="text-sm text-gray-500">{{ quartier.code || 'Q-' + quartier.id }}</p>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Actif
                  </span>
                </div>
                <p class="mt-2 text-sm text-gray-600 line-clamp-2">{{ quartier.description }}</p>
              </div>

              <!-- Statistiques principales -->
              <div class="p-4">
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ quartier.population | number }}</div>
                    <div class="text-xs text-gray-500">Population</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">{{ quartier.nombreFamilles | number }}</div>
                    <div class="text-xs text-gray-500">Familles</div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-lg font-semibold text-purple-600">{{ quartier.superficie | number }} m²</div>
                    <div class="text-xs text-gray-500">Superficie</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-orange-600">
                      {{ (quartier.population / quartier.superficie * 1000000) | number:'1.0-1' }}
                    </div>
                    <div class="text-xs text-gray-500">Hab/km²</div>
                  </div>
                </div>

                <!-- Chef de quartier -->
                <div class="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div class="text-sm font-medium text-gray-900">Chef de quartier</div>
                  <div class="text-sm text-gray-600">{{ quartier.chef.nom }} {{ quartier.chef.prenoms }}</div>
                  <div class="text-xs text-gray-500">{{ quartier.chef.telephone }}</div>
                </div>

                <!-- Infrastructures -->
                <div class="mb-4">
                  <div class="text-sm font-medium text-gray-900 mb-2">Infrastructures</div>
                  <div class="grid grid-cols-3 gap-2 text-xs">
                    <div class="text-center">
                      <div class="font-semibold text-blue-600">{{ quartier.infrastructures?.ecoles || 0 }}</div>
                      <div class="text-gray-500">Écoles</div>
                    </div>
                    <div class="text-center">
                      <div class="font-semibold text-red-600">{{ quartier.infrastructures?.centres_sante || 0 }}</div>
                      <div class="text-gray-500">Santé</div>
                    </div>
                    <div class="text-center">
                      <div class="font-semibold text-green-600">{{ quartier.infrastructures?.marches || 0 }}</div>
                      <div class="text-gray-500">Marchés</div>
                    </div>
                  </div>
                </div>

                <!-- Services -->
                <div class="mb-4">
                  <div class="text-sm font-medium text-gray-900 mb-2">Services disponibles (%)</div>
                  <div class="flex flex-wrap gap-1">
                    @if (quartier.services?.eau_courante) {
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Eau: {{ quartier.services?.eau_courante }}%
                      </span>
                    }
                    @if (quartier.services?.electricite) {
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Électricité: {{ quartier.services?.electricite }}%
                      </span>
                    }
                    @if (quartier.services?.internet) {
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        Internet: {{ quartier.services?.internet }}%
                      </span>
                    }
                    @if (quartier.services?.assainissement) {
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Assainissement: {{ quartier.services?.assainissement }}%
                      </span>
                    }
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button
                  (click)="viewQuartier(quartier)"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Voir détails
                </button>
                <div class="space-x-2">
                  <button
                    (click)="editQuartier(quartier)"
                    class="text-orange-600 hover:text-orange-800 text-sm font-medium">
                    Modifier
                  </button>
                  <button
                    (click)="deleteQuartier(quartier)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          }
        }
      </div>

      <!-- Modal de création/modification -->
      @if (showModal) {
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ editingQuartier ? 'Modifier le quartier' : 'Nouveau quartier' }}
              </h3>
              <button
                (click)="closeModal()"
                class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <form [formGroup]="quartierForm" (ngSubmit)="saveQuartier()" class="space-y-6">
              <!-- Informations de base -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nom du quartier *</label>
                  <input
                    type="text"
                    formControlName="nom"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    formControlName="code"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  formControlName="description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
              </div>

              <!-- Données démographiques -->
              <div class="border-t pt-4">
                <h4 class="text-md font-medium text-gray-900 mb-3">Données démographiques</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Population *</label>
                    <input
                      type="number"
                      formControlName="population"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de familles *</label>
                    <input
                      type="number"
                      formControlName="nombreFamilles"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Superficie (m²) *</label>
                    <input
                      type="number"
                      formControlName="superficie"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                </div>
              </div>

              <!-- Chef de quartier -->
              <div class="border-t pt-4">
                <h4 class="text-md font-medium text-gray-900 mb-3">Chef de quartier</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      formControlName="chefNom"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prénoms *</label>
                    <input
                      type="text"
                      formControlName="chefPrenoms"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      formControlName="chefTelephone"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      formControlName="chefEmail"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
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
                  [disabled]="!quartierForm.valid || saving"
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
export class QuartierListComponent implements OnInit {
  quartiers: Quartier[] = [];
  filteredQuartiers: Quartier[] = [];
  loading = false;
  showModal = false;
  editingQuartier: Quartier | null = null;
  saving = false;

  searchCriteria = {
    nom: '',
    code: ''
  };

  quartierForm: FormGroup;

  constructor(
    private quartierService: QuartierService,
    private fb: FormBuilder
  ) {
    this.quartierForm = this.fb.group({
      nom: ['', [Validators.required]],
      code: [''],
      description: [''],
      population: [0, [Validators.required, Validators.min(0)]],
      nombreFamilles: [0, [Validators.required, Validators.min(0)]],
      superficie: [0, [Validators.required, Validators.min(0)]],
      chefNom: ['', [Validators.required]],
      chefPrenoms: ['', [Validators.required]],
      chefTelephone: ['', [Validators.required]],
      chefEmail: ['']
    });
  }

  ngOnInit() {
    this.loadQuartiers();
  }

  loadQuartiers() {
    this.loading = true;
    this.quartierService.getAllQuartiers().subscribe({
      next: (quartiers) => {
        this.quartiers = quartiers;
        this.filteredQuartiers = quartiers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des quartiers:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (!this.searchCriteria.nom.trim() && !this.searchCriteria.code.trim()) {
      this.filteredQuartiers = this.quartiers;
      return;
    }

    this.filteredQuartiers = this.quartiers.filter(quartier => {
      const matchNom = !this.searchCriteria.nom || 
        quartier.nom.toLowerCase().includes(this.searchCriteria.nom.toLowerCase());
      const matchCode = !this.searchCriteria.code || 
        (quartier.code && quartier.code.toLowerCase().includes(this.searchCriteria.code.toLowerCase()));
      
      return matchNom && matchCode;
    });
  }

  resetSearch() {
    this.searchCriteria = { nom: '', code: '' };
    this.filteredQuartiers = this.quartiers;
  }

  openCreateModal() {
    this.editingQuartier = null;
    this.quartierForm.reset();
    this.showModal = true;
  }

  editQuartier(quartier: Quartier) {
    this.editingQuartier = quartier;
    this.quartierForm.patchValue({
      nom: quartier.nom,
      code: quartier.code,
      description: quartier.description,
      population: quartier.population,
      nombreFamilles: quartier.nombreFamilles,
      superficie: quartier.superficie,
      chefNom: quartier.chef.nom,
      chefPrenoms: quartier.chef.prenoms,
      chefTelephone: quartier.chef.telephone,
      chefEmail: quartier.chef.email
    });
    this.showModal = true;
  }

  viewQuartier(quartier: Quartier) {
    // Implémenter la navigation vers le détail
    console.log('Voir quartier:', quartier);
  }

  deleteQuartier(quartier: Quartier) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le quartier ${quartier.nom} ?`)) {
      this.quartierService.deleteQuartier(quartier.id).subscribe({
        next: () => {
          this.loadQuartiers();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du quartier');
        }
      });
    }
  }

  saveQuartier() {
    if (this.quartierForm.valid) {
      this.saving = true;
      const formData = this.quartierForm.value;
      
      const quartierData: Omit<Quartier, 'id' | 'createdAt' | 'updatedAt'> = {
        nom: formData.nom,
        code: formData.code,
        description: formData.description,
        population: formData.population,
        nombreFamilles: formData.nombreFamilles,
        superficie: formData.superficie,
        chef: {
          nom: formData.chefNom,
          prenoms: formData.chefPrenoms,
          telephone: formData.chefTelephone,
          email: formData.chefEmail
        },
        coordonnees: this.editingQuartier?.coordonnees || { latitude: 5.3198, longitude: -4.0267 },
        infrastructures: this.editingQuartier?.infrastructures || {
          ecoles: 0,
          centres_sante: 0,
          marches: 0,
          lieux_culte: 0,
          terrains_sport: 0
        },
        services: this.editingQuartier?.services || {
          eau_courante: 0,
          electricite: 0,
          assainissement: 0,
          internet: 0,
          transport_public: 0
        },
        projets: this.editingQuartier?.projets || []
      };

      const operation = this.editingQuartier 
        ? this.quartierService.updateQuartier(this.editingQuartier.id, quartierData)
        : this.quartierService.createQuartier(quartierData);

      operation.subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          this.loadQuartiers();
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
    this.editingQuartier = null;
    this.quartierForm.reset();
  }
}
