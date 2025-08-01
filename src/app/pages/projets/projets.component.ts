import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Gestion des Projets</h1>
      <div class="card">
        <p class="text-gray-600">Cette page sera développée pour gérer les projets municipaux.</p>
        <div class="mt-4 p-4 bg-orange-50 rounded-lg">
          <h3 class="font-semibold text-orange-900">Fonctionnalités prévues :</h3>
          <ul class="mt-2 text-orange-800 space-y-1">
            <li>• Listing des projets par statut</li>
            <li>• Suivi des budgets et réalisations</li>
            <li>• Planning et échéanciers</li>
            <li>• Indicateurs de performance</li>
            <li>• Rapports de progression</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class ProjetsComponent {}
