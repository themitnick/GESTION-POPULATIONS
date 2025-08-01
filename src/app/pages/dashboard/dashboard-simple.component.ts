import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { StatistiqueService } from '../../services/statistique-simple.service';
import { StatistiquesGenerales } from '../../models/statistique.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Tableau de Bord - Gestion des Populations</h1>
      
      @if (isLoading) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      } @else {
        @if (statistiquesGenerales$ | async; as stats) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Familles</h3>
              <p class="text-3xl font-bold text-blue-600">{{ stats.totalFamilles }}</p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Membres</h3>
              <p class="text-3xl font-bold text-green-600">{{ stats.totalMembres }}</p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">Quartiers</h3>
              <p class="text-3xl font-bold text-purple-600">{{ stats.totalQuartiers }}</p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">Projets</h3>
              <p class="text-3xl font-bold text-orange-600">{{ stats.totalProjets }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Répartition par Sexe</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span>Hommes:</span>
                  <span class="font-bold">{{ stats.repartitionParSexe.hommes }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Femmes:</span>
                  <span class="font-bold">{{ stats.repartitionParSexe.femmes }}</span>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Répartition par Âge</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span>Enfants (< 18 ans):</span>
                  <span class="font-bold">{{ stats.repartitionParAge.enfants }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Adultes (≥ 18 ans):</span>
                  <span class="font-bold">{{ stats.repartitionParAge.adultes }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8 text-center">
            <p class="text-green-600 font-semibold">✅ Application fonctionnelle ! Le service StatistiqueService fonctionne correctement.</p>
            <p class="text-sm text-gray-500 mt-2">Dernière mise à jour: {{ lastUpdate | date:'short' }}</p>
            <button 
              (click)="refreshData()" 
              class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Actualiser
            </button>
          </div>
        }
      }
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistiquesGenerales$!: Observable<StatistiquesGenerales>;
  isLoading = true;
  lastUpdate = new Date();

  constructor(
    private statistiqueService: StatistiqueService
  ) {}

  ngOnInit() {
    this.loadStatistiques();
  }

  private loadStatistiques() {
    this.statistiquesGenerales$ = this.statistiqueService.getStatistiquesGenerales();
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  refreshData() {
    this.isLoading = true;
    this.loadStatistiques();
    this.lastUpdate = new Date();
  }
}
