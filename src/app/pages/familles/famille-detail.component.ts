import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FamilleService } from '../../services/famille.service';
import { Famille, Membre } from '../../models/famille.model';

@Component({
  selector: 'app-famille-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      @if (loading) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span class="ml-2 text-gray-600">Chargement...</span>
        </div>
      } @else if (famille) {
        <!-- En-tête -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ famille.nomFamille }}</h1>
              <p class="text-gray-600">{{ famille.numeroCompte }}</p>
              <div class="mt-2">
                <span [class]="getStatutClass(famille.statutValidation)">
                  {{ famille.statutValidation }}
                </span>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                (click)="editFamille()"
                class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Modifier
              </button>
              <button
                [routerLink]="['/familles']"
                class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                Retour
              </button>
            </div>
          </div>
        </div>

        <!-- Informations générales -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Informations famille -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
            <div class="space-y-3">
              <div>
                <span class="text-sm font-medium text-gray-500">Nombre de membres</span>
                <p class="text-lg font-semibold text-gray-900">{{ famille.nombreMembres }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Date de création</span>
                <p class="text-gray-900">{{ famille.dateCreation | date:'dd/MM/yyyy' }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Dernière mise à jour</span>
                <p class="text-gray-900">{{ famille.dateMiseAJour | date:'dd/MM/yyyy à HH:mm' }}</p>
              </div>
            </div>
          </div>

          <!-- Adresse -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Adresse</h2>
            <div class="space-y-2">
              <p class="text-gray-900">{{ famille.adresse.rue }}</p>
              <p class="text-gray-600">{{ famille.adresse.quartier }}</p>
              <p class="text-gray-600">{{ famille.adresse.codePostal }} {{ famille.adresse.ville }}</p>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Hommes</span>
                <span class="font-medium">{{ getStatistiques().hommes }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Femmes</span>
                <span class="font-medium">{{ getStatistiques().femmes }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Enfants (< 18 ans)</span>
                <span class="font-medium">{{ getStatistiques().enfants }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Adultes (≥ 18 ans)</span>
                <span class="font-medium">{{ getStatistiques().adultes }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chef de famille -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Chef de famille</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-500">Nom complet</span>
              <p class="text-gray-900">{{ famille.chefFamille.nom }} {{ famille.chefFamille.prenoms }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Sexe</span>
              <p class="text-gray-900">{{ famille.chefFamille.sexe === 'M' ? 'Masculin' : 'Féminin' }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Date de naissance</span>
              <p class="text-gray-900">{{ famille.chefFamille.dateNaissance | date:'dd/MM/yyyy' }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Âge</span>
              <p class="text-gray-900">{{ getAge(famille.chefFamille.dateNaissance) }} ans</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Lieu de naissance</span>
              <p class="text-gray-900">{{ famille.chefFamille.lieuNaissance }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Nationalité</span>
              <p class="text-gray-900">{{ famille.chefFamille.nationalite }}</p>
            </div>
            @if (famille.chefFamille.telephone) {
              <div>
                <span class="text-sm font-medium text-gray-500">Téléphone</span>
                <p class="text-gray-900">{{ famille.chefFamille.telephone }}</p>
              </div>
            }
            @if (famille.chefFamille.email) {
              <div>
                <span class="text-sm font-medium text-gray-500">Email</span>
                <p class="text-gray-900">{{ famille.chefFamille.email }}</p>
              </div>
            }
          </div>
        </div>

        <!-- Liste des membres -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Membres de la famille</h2>
            <button
              (click)="openAddMembreModal()"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Ajouter un membre
            </button>
          </div>

          @if (famille.membres.length === 0) {
            <div class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun membre ajouté</h3>
              <p class="mt-1 text-sm text-gray-500">Commencez par ajouter les membres de cette famille.</p>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom complet</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relation</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (membre of famille.membres; track membre.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ membre.nom }} {{ membre.prenoms }}</div>
                        @if (membre.estChefFamille) {
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            Chef de famille
                          </span>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ membre.sexe === 'M' ? 'Masculin' : 'Féminin' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ getAge(membre.dateNaissance) }} ans
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ membre.relationChef || 'Non définie' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span [class]="membre.estActif ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'">
                          {{ membre.estActif ? 'Actif' : 'Inactif' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex space-x-2">
                          <button
                            (click)="editMembre(membre)"
                            class="text-orange-600 hover:text-orange-900">
                            Modifier
                          </button>
                          @if (!membre.estChefFamille) {
                            <button
                              (click)="deleteMembre(membre)"
                              class="text-red-600 hover:text-red-900">
                              Supprimer
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>

        <!-- Modal d'ajout/modification de membre -->
        @if (showMembreModal) {
          <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ editingMembre ? 'Modifier le membre' : 'Ajouter un membre' }}
                </h3>
                <button (click)="closeMembreModal()" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <form [formGroup]="membreForm" (ngSubmit)="saveMembre()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input formControlName="nom" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prénoms *</label>
                    <input formControlName="prenoms" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sexe *</label>
                    <select formControlName="sexe" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">Sélectionner</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
                    <input formControlName="dateNaissance" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
                    <input formControlName="lieuNaissance" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
                    <input formControlName="nationalite" type="text" value="Ivoirienne" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Relation avec le chef</label>
                    <select formControlName="relationChef" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">Sélectionner</option>
                      <option value="Époux/Épouse">Époux/Épouse</option>
                      <option value="Fils/Fille">Fils/Fille</option>
                      <option value="Père/Mère">Père/Mère</option>
                      <option value="Frère/Sœur">Frère/Sœur</option>
                      <option value="Grand-parent">Grand-parent</option>
                      <option value="Petit-enfant">Petit-enfant</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input formControlName="telephone" type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input formControlName="email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                  <button type="button" (click)="closeMembreModal()" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Annuler
                  </button>
                  <button type="submit" [disabled]="membreForm.invalid" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">
                    {{ editingMembre ? 'Modifier' : 'Ajouter' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
      } @else {
        <div class="text-center py-12">
          <h3 class="text-lg font-medium text-gray-900">Famille non trouvée</h3>
          <p class="mt-1 text-sm text-gray-500">Cette famille n'existe pas ou a été supprimée.</p>
          <button [routerLink]="['/familles']" class="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Retour à la liste
          </button>
        </div>
      }
    </div>
  `
})
export class FamilleDetailComponent implements OnInit {
  famille: Famille | null = null;
  loading = true;
  showMembreModal = false;
  editingMembre: Membre | null = null;
  membreForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familleService: FamilleService,
    private fb: FormBuilder
  ) {
    this.membreForm = this.fb.group({
      nom: ['', Validators.required],
      prenoms: ['', Validators.required],
      sexe: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      lieuNaissance: [''],
      nationalite: ['Ivoirienne'],
      relationChef: [''],
      telephone: [''],
      email: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFamille(id);
    }
  }

  loadFamille(id: string) {
    this.loading = true;
    this.familleService.getFamilleById(id).subscribe({
      next: (famille) => {
        this.famille = famille;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la famille:', error);
        this.loading = false;
      }
    });
  }

  editFamille() {
    if (this.famille) {
      this.router.navigate(['/familles', this.famille.id, 'edit']);
    }
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

  getAge(dateNaissance: Date): number {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getStatistiques() {
    if (!this.famille) return { hommes: 0, femmes: 0, enfants: 0, adultes: 0 };

    const hommes = this.famille.membres.filter(m => m.sexe === 'M').length;
    const femmes = this.famille.membres.filter(m => m.sexe === 'F').length;
    const enfants = this.famille.membres.filter(m => this.getAge(m.dateNaissance) < 18).length;
    const adultes = this.famille.membres.filter(m => this.getAge(m.dateNaissance) >= 18).length;

    return { hommes, femmes, enfants, adultes };
  }

  openAddMembreModal() {
    this.editingMembre = null;
    this.membreForm.reset();
    this.membreForm.patchValue({ nationalite: 'Ivoirienne' });
    this.showMembreModal = true;
  }

  editMembre(membre: Membre) {
    this.editingMembre = membre;
    this.membreForm.patchValue({
      nom: membre.nom,
      prenoms: membre.prenoms,
      sexe: membre.sexe,
      dateNaissance: this.formatDateForInput(membre.dateNaissance),
      lieuNaissance: membre.lieuNaissance,
      nationalite: membre.nationalite,
      relationChef: membre.relationChef,
      telephone: membre.telephone,
      email: membre.email
    });
    this.showMembreModal = true;
  }

  saveMembre() {
    if (this.membreForm.valid && this.famille) {
      const formData = this.membreForm.value;
      const membreData = {
        nom: formData.nom,
        prenoms: formData.prenoms,
        sexe: formData.sexe,
        dateNaissance: new Date(formData.dateNaissance),
        lieuNaissance: formData.lieuNaissance || '',
        nationalite: formData.nationalite || 'Ivoirienne',
        relationChef: formData.relationChef,
        telephone: formData.telephone,
        email: formData.email,
        estChefFamille: false,
        estActif: true
      };

      if (this.editingMembre) {
        this.familleService.updateMembre(this.famille.id, this.editingMembre.id, membreData).subscribe({
          next: () => {
            this.loadFamille(this.famille!.id);
            this.closeMembreModal();
          },
          error: (error) => console.error('Erreur lors de la modification:', error)
        });
      } else {
        this.familleService.addMembreToFamille(this.famille.id, membreData).subscribe({
          next: () => {
            this.loadFamille(this.famille!.id);
            this.closeMembreModal();
          },
          error: (error) => console.error('Erreur lors de l\'ajout:', error)
        });
      }
    }
  }

  deleteMembre(membre: Membre) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${membre.nom} ${membre.prenoms} ?`) && this.famille) {
      this.familleService.deleteMembre(this.famille.id, membre.id).subscribe({
        next: () => {
          this.loadFamille(this.famille!.id);
        },
        error: (error) => console.error('Erreur lors de la suppression:', error)
      });
    }
  }

  closeMembreModal() {
    this.showMembreModal = false;
    this.editingMembre = null;
    this.membreForm.reset();
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
