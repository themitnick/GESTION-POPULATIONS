import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-familles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Gestion des Familles</h1>
      <div class="card">
        <p class="text-gray-600">Cette page sera développée pour gérer les familles et leurs membres.</p>
        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-semibold text-blue-900">Fonctionnalités prévues :</h3>
          <ul class="mt-2 text-blue-800 space-y-1">
            <li>• Listing des familles</li>
            <li>• Ajout/modification de familles</li>
            <li>• Gestion des membres de famille</li>
            <li>• Recherche et filtres</li>
            <li>• Export des données</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class FamillesComponent {}
