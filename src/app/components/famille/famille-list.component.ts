import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FamilleService } from '../../services/famille.service';
import { Famille, Membre } from '../../models/famille.model';

@Component({
  selector: 'app-famille-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <!-- En-tête -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestion des Familles</h1>
          <p class="text-gray-600">Gérer les familles et leurs membres</p>
        </div>
        <button
          (click)="openCreateModal()"
          class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Nouvelle Famille
        </button>
      </div>

      <!-- Filtres de recherche -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom de famille</label>
            <input
              type="text"
              [(ngModel)]="searchCriteria.nom"
              (ngModelChange)="onSearch()"
              placeholder="Rechercher par nom..."
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              [(ngModel)]="searchCriteria.statut"
              (ngModelChange)="onSearch()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Tous les statuts</option>
              <option value="Validé">Validé</option>
              <option value="Brouillon">Brouillon</option>
              <option value="Archivé">Archivé</option>
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

      <!-- Liste des familles -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-medium text-gray-900">
            Familles ({{ filteredFamilles.length }})
          </h3>
        </div>
        
        @if (loading) {
          <div class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Chargement...</p>
          </div>
        } @else if (filteredFamilles.length === 0) {
          <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune famille trouvée</h3>
            <p class="mt-1 text-sm text-gray-500">Commencez par ajouter une nouvelle famille.</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Famille
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chef de famille
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quartier
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membres
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (famille of filteredFamilles; track famille.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ famille.nomFamille }}</div>
                      <div class="text-sm text-gray-500">{{ famille.numeroCompte }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {{ famille.chefFamille.nom }} {{ famille.chefFamille.prenoms }}
                      </div>
                      <div class="text-sm text-gray-500">{{ famille.chefFamille.telephone }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ famille.adresse.quartier }}</div>
                      <div class="text-sm text-gray-500">{{ famille.adresse.rue }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ famille.nombreMembres }} membres
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="getStatutClass(famille.statutValidation)">
                        {{ famille.statutValidation }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                        <button
                          (click)="viewFamille(famille)"
                          class="text-blue-600 hover:text-blue-900">
                          Voir
                        </button>
                        <button
                          (click)="editFamille(famille)"
                          class="text-orange-600 hover:text-orange-900">
                          Modifier
                        </button>
                        <button
                          (click)="deleteFamille(famille)"
                          class="text-red-600 hover:text-red-900">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Modal de création/modification -->
      @if (showModal) {
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ editingFamille ? 'Modifier la famille' : 'Nouvelle famille' }}
              </h3>
              <button
                (click)="closeModal()"
                class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <form [formGroup]="familleForm" (ngSubmit)="saveFamille()" class="space-y-4">
              <!-- Informations de base -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nom de famille</label>
                  <input
                    type="text"
                    formControlName="nomFamille"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de compte</label>
                  <input
                    type="text"
                    formControlName="numeroCompte"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
              </div>

              <!-- Adresse -->
              <div class="border-t pt-4">
                <h4 class="text-md font-medium text-gray-900 mb-3">Adresse</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rue</label>
                    <input
                      type="text"
                      formControlName="rue"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
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
                    <label class="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                    <input
                      type="text"
                      formControlName="codePostal"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <input
                      type="text"
                      formControlName="ville"
                      value="Abidjan"
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
                  [disabled]="!familleForm.valid || saving"
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
      max-width: 1200px;
    }
  `]
})
export class FamilleListComponent implements OnInit {
  familles: Famille[] = [];
  filteredFamilles: Famille[] = [];
  loading = false;
  showModal = false;
  editingFamille: Famille | null = null;
  saving = false;

  searchCriteria = {
    nom: '',
    quartier: '',
    statut: ''
  };

  familleForm: FormGroup;

  constructor(
    private familleService: FamilleService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.familleForm = this.fb.group({
      nomFamille: ['', [Validators.required]],
      numeroCompte: [''],
      rue: ['', [Validators.required]],
      quartier: ['', [Validators.required]],
      codePostal: ['01'],
      ville: ['Abidjan']
    });
  }

  ngOnInit() {
    this.loadFamilles();
  }

  loadFamilles() {
    this.loading = true;
    this.familleService.getAllFamilles().subscribe({
      next: (familles) => {
        this.familles = familles;
        this.filteredFamilles = familles;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des familles:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.familleService.searchFamilles(this.searchCriteria).subscribe({
      next: (familles) => {
        this.filteredFamilles = familles;
      }
    });
  }

  resetSearch() {
    this.searchCriteria = { nom: '', quartier: '', statut: '' };
    this.filteredFamilles = this.familles;
  }

  openCreateModal() {
    this.editingFamille = null;
    this.familleForm.reset();
    this.familleForm.patchValue({
      codePostal: '01',
      ville: 'Abidjan'
    });
    this.showModal = true;
  }

  editFamille(famille: Famille) {
    this.editingFamille = famille;
    this.familleForm.patchValue({
      nomFamille: famille.nomFamille,
      numeroCompte: famille.numeroCompte,
      rue: famille.adresse.rue,
      quartier: famille.adresse.quartier,
      codePostal: famille.adresse.codePostal,
      ville: famille.adresse.ville
    });
    this.showModal = true;
  }

  viewFamille(famille: Famille) {
    this.router.navigate(['/familles', famille.id]);
  }

  deleteFamille(famille: Famille) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la famille ${famille.nomFamille} ?`)) {
      this.familleService.deleteFamille(famille.id).subscribe({
        next: () => {
          this.loadFamilles();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la famille');
        }
      });
    }
  }

  saveFamille() {
    if (this.familleForm.valid) {
      this.saving = true;
      const formData = this.familleForm.value;
      
      const familleData = {
        nomFamille: formData.nomFamille,
        numeroCompte: formData.numeroCompte,
        adresse: {
          rue: formData.rue,
          quartier: formData.quartier,
          codePostal: formData.codePostal,
          ville: formData.ville
        },
        // Données par défaut pour une nouvelle famille
        chefFamille: this.editingFamille?.chefFamille || this.createDefaultChef(formData.nomFamille),
        membres: this.editingFamille?.membres || [],
        nombreMembres: this.editingFamille?.nombreMembres || 0,
        dateCreation: new Date(),
        statutValidation: this.editingFamille?.statutValidation || 'Brouillon' as const,
        // Propriétés optionnelles avec valeurs par défaut
        revenusEstimes: this.editingFamille?.revenusEstimes,
        typeLogement: this.editingFamille?.typeLogement,
        sourceEau: this.editingFamille?.sourceEau,
        sourceElectricite: this.editingFamille?.sourceElectricite,
        evacuationEaux: this.editingFamille?.evacuationEaux,
        observations: this.editingFamille?.observations
      };

      const operation = this.editingFamille 
        ? this.familleService.updateFamille(this.editingFamille.id, familleData)
        : this.familleService.createFamille(familleData);

      operation.subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          this.loadFamilles();
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
    this.editingFamille = null;
    this.familleForm.reset();
  }

  getStatutClass(statut: string): string {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (statut) {
      case 'Validé':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'Brouillon':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'Archivé':
        return `${baseClass} bg-gray-100 text-gray-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  private createDefaultChef(nomFamille: string): Membre {
    return {
      id: '',
      nom: nomFamille,
      prenoms: '',
      sexe: 'M',
      dateNaissance: new Date(),
      lieuNaissance: '',
      nationalite: 'Ivoirienne',
      estChefFamille: true,
      estActif: true,
      dateEnregistrement: new Date(),
      dateMiseAJour: new Date()
    };
  }
}
