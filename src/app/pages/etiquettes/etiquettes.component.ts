import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatistiqueService } from '../../services/statistique-simple.service';

@Component({
  selector: 'app-etiquettes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Étiquettes</h1>
      <div class="bg-white p-4 rounded shadow">
        <h3 class="text-lg font-semibold mb-4">Fonctionnalité en cours de développement</h3>
        <p>Les fonctionnalités d'étiquettes seront disponibles prochainement.</p>
        <div class="mt-4">
          <button class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Générer étiquettes Noël
          </button>
          <button class="bg-green-500 text-white px-4 py-2 rounded">
            Générer étiquettes Fête des mères
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .p-6 { padding: 1.5rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .font-bold { font-weight: 700; }
    .mb-6 { margin-bottom: 1.5rem; }
    .bg-white { background-color: white; }
    .p-4 { padding: 1rem; }
    .rounded { border-radius: 0.25rem; }
    .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
    .text-lg { font-size: 1.125rem; }
    .font-semibold { font-weight: 600; }
    .mb-4 { margin-bottom: 1rem; }
    .mt-4 { margin-top: 1rem; }
    .bg-blue-500 { background-color: #3b82f6; }
    .bg-green-500 { background-color: #10b981; }
    .text-white { color: white; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .mr-2 { margin-right: 0.5rem; }
    button { cursor: pointer; border: none; }
    button:hover { opacity: 0.9; }
  `]
})
export class EtiquettesComponent implements OnInit {
  
  constructor(private statistiqueService: StatistiqueService) {}

  ngOnInit(): void {
    // Chargement des données si nécessaire
  }
}
