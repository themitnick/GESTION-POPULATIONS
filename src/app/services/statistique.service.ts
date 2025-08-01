import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FamilleSimpleService } from './famille-simple.service';
import { QuartierService } from './quartier.service';
import { ProjetService } from './projet.service';

export interface StatistiquesGenerales {
  totalFamilles: number;
  totalQuartiers: number;
  totalProjets: number;
  totalPopulation: number;
  totalBeneficiaires: number;
  budgetTotal: number;
  densite: number;
}

export interface StatistiquesQuartier {
  id: string;
  nom: string;
  population: number;
  familles: number;
  projets: number;
  superficie: number;
  densite: number;
  budgetAlloue: number;
  services: {
    eau: boolean;
    electricite: boolean;
    assainissement: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  constructor(
    private familleService: FamilleSimpleService,
    private quartierService: QuartierService,
    private projetService: ProjetService
  ) {}

  getStatistiquesGenerales(): Observable<StatistiquesGenerales> {
    return combineLatest([
      this.familleService.familles$,
      this.quartierService.quartiers$,
      this.projetService.projets$
    ]).pipe(
      map(([familles, quartiers, projets]) => {
        const totalPopulation = familles.reduce((acc, f) => acc + f.nombreMembres, 0);
        const totalBeneficiaires = familles.reduce((acc, f) => acc + f.nombreMembres, 0);
        const budgetTotal = projets.reduce((acc, p) => acc + p.budget, 0);
        const superficieTotale = quartiers.reduce((acc, q) => acc + q.superficie, 0);

        return {
          totalFamilles: familles.length,
          totalQuartiers: quartiers.length,
          totalProjets: projets.length,
          totalPopulation,
          totalBeneficiaires,
          budgetTotal,
          densite: superficieTotale > 0 ? totalPopulation / superficieTotale : 0
        };
      })
    );
  }

  getStatistiquesQuartier(quartierNom: string): Observable<StatistiquesQuartier | null> {
    return combineLatest([
      this.familleService.familles$,
      this.quartierService.quartiers$,
      this.projetService.projets$
    ]).pipe(
      map(([familles, quartiers, projets]) => {
        const famillesQuartier = familles.filter(f => f.adresse.quartier === quartierNom);
        const quartier = quartiers.find(q => q.nom === quartierNom);
        const projetsQuartier = projets.filter(p => p.quartierId === quartier?.id);

        if (!quartier) {
          return null;
        }

        const population = famillesQuartier.reduce((acc, f) => acc + f.nombreMembres, 0);
        const budgetAlloue = projetsQuartier.reduce((acc, p) => acc + p.budget, 0);

        return {
          id: quartier.id,
          nom: quartier.nom,
          population,
          familles: famillesQuartier.length,
          projets: projetsQuartier.length,
          superficie: quartier.superficie,
          densite: quartier.superficie > 0 ? population / quartier.superficie : 0,
          budgetAlloue,
          services: {
            eau: (quartier.services?.eau_courante ?? 0) > 0,
            electricite: (quartier.services?.electricite ?? 0) > 0,
            assainissement: (quartier.services?.assainissement ?? 0) > 0
          }
        };
      })
    );
  }

  getAllStatistiquesQuartiers(): Observable<StatistiquesQuartier[]> {
    return combineLatest([
      this.familleService.familles$,
      this.quartierService.quartiers$,
      this.projetService.projets$
    ]).pipe(
      map(([familles, quartiers, projets]) => {
        return quartiers.map(quartier => {
          const famillesQuartier = familles.filter(f => f.adresse.quartier === quartier.nom);
          const projetsQuartier = projets.filter(p => p.quartierId === quartier.id);
          const population = famillesQuartier.reduce((acc, f) => acc + f.nombreMembres, 0);
          const budgetAlloue = projetsQuartier.reduce((acc, p) => acc + p.budget, 0);

          return {
            id: quartier.id,
            nom: quartier.nom,
            population,
            familles: famillesQuartier.length,
            projets: projetsQuartier.length,
            superficie: quartier.superficie,
            densite: quartier.superficie > 0 ? population / quartier.superficie : 0,
            budgetAlloue,
            services: {
              eau: (quartier.services?.eau_courante ?? 0) > 0,
              electricite: (quartier.services?.electricite ?? 0) > 0,
              assainissement: (quartier.services?.assainissement ?? 0) > 0
            }
          };
        });
      })
    );
  }
}
