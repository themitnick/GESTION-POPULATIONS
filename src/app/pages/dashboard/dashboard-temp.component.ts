import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { StatistiqueService } from '../../services/statistique-simple.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold">Statistiques Générales</h3>
          <div *ngIf="statistiquesGenerales$ | async as stats; else loading">
            <p>Familles: {{ stats.totalFamilles }}</p>
            <p>Quartiers: {{ stats.totalQuartiers }}</p>
            <p>Projets: {{ stats.totalProjets }}</p>
            <p>Population: {{ stats.totalPopulation }}</p>
            <p>Budget Total: {{ stats.budgetTotal | currency:'XOF':'symbol':'1.0-0' }}</p>
          </div>
          <ng-template #loading>
            <p>Chargement...</p>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistiquesGenerales$!: Observable<any>;
  
  constructor(
    private statistiqueService: StatistiqueService
  ) {}

  ngOnInit(): void {
    this.statistiquesGenerales$ = this.statistiqueService.getStatistiquesGenerales();
  }
}
