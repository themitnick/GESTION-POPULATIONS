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
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Gestion des Quartiers</h1>
        <button
          (click)="openModal()"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nouveau Quartier
        </button>
      </div>

      <!-- Barre de recherche -->
      <div class="mb-6">
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            placeholder="Rechercher un quartier..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Liste des quartiers -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (quartier of filteredQuartiers; track quartier.id) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-semibold text-gray-900">{{ quartier.nom }}</h3>
                  <p class="text-sm text-gray-500">ID: {{ quartier.id }}</p>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Actif
                </span>
              </div>

              @if (quartier.description) {
                <p class="text-gray-600 mb-4 text-sm">{{ quartier.description }}</p>
              }

              <!-- Statistiques -->
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="text-center">
                  <div class="text-lg font-bold text-blue-600">{{ quartier.population | number }}</div>
                  <div class="text-xs text-gray-500">Population</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-green-600">{{ quartier.nombreFamilles | number }}</div>
                  <div class="text-xs text-gray-500">Familles</div>
                </div>
              </div>

              <!-- Infrastructures -->
              @if (quartier.infrastructures) {
                <div class="mb-4">
                  <div class="text-sm font-medium text-gray-700 mb-2">Infrastructures</div>
                  <div class="grid grid-cols-3 gap-2 text-xs">
                    <div class="text-center">
                      <div class="font-semibold text-blue-600">{{ quartier.infrastructures.ecoles }}</div>
                      <div class="text-gray-500">Écoles</div>
                    </div>
                    <div class="text-center">
                      <div class="font-semibold text-red-600">{{ quartier.infrastructures.centres_sante }}</div>
                      <div class="text-gray-500">Santé</div>
                    </div>
                    <div class="text-center">
                      <div class="font-semibold text-green-600">{{ quartier.infrastructures.marches }}</div>
                      <div class="text-gray-500">Marchés</div>
                    </div>
                  </div>
                </div>
              }

              <!-- Services -->
              @if (quartier.services) {
                <div class="mb-4">
                  <div class="text-sm font-medium text-gray-700 mb-2">Services (%)</div>
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Eau: {{ quartier.services.eau_courante }}%
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Électricité: {{ quartier.services.electricite }}%
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Assainissement: {{ quartier.services.assainissement }}%
                    </span>
                  </div>
                </div>
              }

              <!-- Actions -->
              <div class="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                  (click)="editQuartier(quartier)"
                  class="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Modifier
                </button>
                <button
                  (click)="deleteQuartier(quartier)"
                  class="flex-1 text-red-600 hover:text-red-800 text-sm font-medium">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Modal (simplifié) -->
      @if (showModal) {
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ editingQuartier ? 'Modifier' : 'Ajouter' }} un quartier
              </h3>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form [formGroup]="quartierForm" (ngSubmit)="saveQuartier()">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nom *</label>
                  <input formControlName="nom" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea formControlName="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                </div>
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <button type="button" (click)="closeModal()" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" [disabled]="quartierForm.invalid" class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  {{ editingQuartier ? 'Modifier' : 'Ajouter' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class QuartierListComponent implements OnInit {
  quartiers: Quartier[] = [];
  filteredQuartiers: Quartier[] = [];
  searchTerm = '';
  showModal = false;
  editingQuartier: Quartier | null = null;
  quartierForm: FormGroup;

  constructor(
    private quartierService: QuartierService,
    private fb: FormBuilder
  ) {
    this.quartierForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadQuartiers();
  }

  loadQuartiers() {
    this.quartierService.getAllQuartiers().subscribe({
      next: (quartiers) => {
        this.quartiers = quartiers;
        this.filteredQuartiers = quartiers;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des quartiers:', error);
      }
    });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredQuartiers = this.quartiers;
      return;
    }

    this.quartierService.searchQuartiers(this.searchTerm).subscribe({
      next: (quartiers) => {
        this.filteredQuartiers = quartiers;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
      }
    });
  }

  openModal() {
    this.showModal = true;
    this.editingQuartier = null;
    this.quartierForm.reset();
  }

  closeModal() {
    this.showModal = false;
    this.editingQuartier = null;
    this.quartierForm.reset();
  }

  editQuartier(quartier: Quartier) {
    this.editingQuartier = quartier;
    this.showModal = true;
    
    this.quartierForm.patchValue({
      nom: quartier.nom,
      description: quartier.description || ''
    });
  }

  saveQuartier() {
    if (this.quartierForm.invalid) {
      return;
    }

    console.log('Sauvegarde du quartier:', this.quartierForm.value);
    this.closeModal();
  }

  deleteQuartier(quartier: Quartier) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le quartier "${quartier.nom}" ?`)) {
      this.quartierService.deleteQuartier(quartier.id).subscribe({
        next: () => {
          this.loadQuartiers();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
}
