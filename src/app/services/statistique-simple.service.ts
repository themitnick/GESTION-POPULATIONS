import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { FamilleSimpleService, FamilleSimple } from './famille-simple.service';
import { QuartierService } from './quartier.service';
import { ProjetService } from './projet.service';
import { StatistiquesGenerales, StatistiquesQuartier } from '../models/statistique.model';
import { Quartier } from '../models/quartier.model';
import { Projet } from '../models/quartier.model';

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
      map(([familles, quartiers, projets]: [FamilleSimple[], Quartier[], Projet[]]) => {
        const totalMembres = familles.reduce((sum: number, f: FamilleSimple) => sum + f.nombreMembres, 0);
        const totalFemmes = familles.reduce((sum: number, f: FamilleSimple) => 
          sum + f.membres.filter(m => m.sexe === 'F').length, 0);
        const totalHommes = familles.reduce((sum: number, f: FamilleSimple) => 
          sum + f.membres.filter(m => m.sexe === 'M').length, 0);
        const totalEnfants = familles.reduce((sum: number, f: FamilleSimple) => 
          sum + f.membres.filter(m => this.calculateAge(m.dateNaissance.toISOString()) < 18).length, 0);

        const stats: StatistiquesGenerales = {
          totalFamilles: familles.length,
          totalMembres,
          totalQuartiers: quartiers.length,
          totalProjets: projets.length,
          repartitionParSexe: {
            hommes: totalHommes,
            femmes: totalFemmes
          },
          repartitionParAge: {
            enfants: totalEnfants,
            adultes: totalMembres - totalEnfants
          },
          famillesParQuartier: this.getFamillesParQuartier(familles),
          evolutionMensuelle: this.getEvolutionMensuelle()
        };

        return stats;
      })
    );
  }

  getStatistiquesQuartier(quartierNom: string): Observable<StatistiquesQuartier> {
    return combineLatest([
      this.familleService.familles$,
      this.quartierService.quartiers$,
      this.projetService.projets$
    ]).pipe(
      map(([familles, quartiers, projets]: [FamilleSimple[], Quartier[], Projet[]]) => {
        const famillesQuartier = familles.filter(f => f.adresse.quartier === quartierNom);
        const quartier = quartiers.find(q => q.nom === quartierNom);
        const projetsQuartier = projets.filter(p => {
          const quartierProjet = quartiers.find(q => q.id === p.quartierId);
          return quartierProjet && quartierProjet.nom === quartierNom;
        });
        
        if (!quartier) {
          throw new Error('Quartier non trouvé');
        }

        const totalMembres = famillesQuartier.reduce((sum: number, f: FamilleSimple) => sum + f.nombreMembres, 0);
        const totalFemmes = famillesQuartier.reduce((sum: number, f: FamilleSimple) => 
          sum + f.membres.filter(m => m.sexe === 'F').length, 0);
        const totalHommes = famillesQuartier.reduce((sum: number, f: FamilleSimple) => 
          sum + f.membres.filter(m => m.sexe === 'M').length, 0);
        const totalEnfants = famillesQuartier.reduce((sum: number, f: FamilleSimple) => 
          sum + f.membres.filter(m => this.calculateAge(m.dateNaissance.toISOString()) < 18).length, 0);

        const stats: StatistiquesQuartier = {
          quartier: quartier.nom,
          nombreFamilles: famillesQuartier.length,
          nombreMembres: totalMembres,
          nombreProjets: projetsQuartier.length,
          population: {
            total: totalMembres,
            hommes: totalHommes,
            femmes: totalFemmes,
            enfants: totalEnfants,
            adultes: totalMembres - totalEnfants
          },
          infrastructures: quartier.infrastructures ? {
            ecoles: quartier.infrastructures.ecoles > 0,
            centres_sante: quartier.infrastructures.centres_sante > 0,
            marches: quartier.infrastructures.marches > 0,
            lieux_culte: quartier.infrastructures.lieux_culte > 0,
            terrains_sport: quartier.infrastructures.terrains_sport > 0
          } : {},
          services: quartier.services ? {
            eau_courante: quartier.services.eau_courante > 0,
            electricite: quartier.services.electricite > 0,
            assainissement: quartier.services.assainissement > 0,
            internet: quartier.services.internet > 0,
            transport_public: quartier.services.transport_public > 0
          } : {},
          projetsActifs: projetsQuartier.filter((p: Projet) => p.statut === 'en-cours').length,
          budgetTotal: projetsQuartier.reduce((sum: number, p: Projet) => sum + p.budget, 0),
          derniereMiseAJour: new Date()
        };

        return stats;
      })
    );
  }

  private calculateAge(dateNaissance: string): number {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private getFamillesParQuartier(familles: FamilleSimple[]): { [quartier: string]: number } {
    const repartition: { [quartier: string]: number } = {};
    familles.forEach((famille: FamilleSimple) => {
      const quartier = famille.adresse.quartier;
      repartition[quartier] = (repartition[quartier] || 0) + 1;
    });
    return repartition;
  }

  private getEvolutionMensuelle(): { mois: string; nouvelles: number }[] {
    return [
      { mois: 'Jan', nouvelles: 12 },
      { mois: 'Feb', nouvelles: 8 },
      { mois: 'Mar', nouvelles: 15 },
      { mois: 'Apr', nouvelles: 18 },
      { mois: 'May', nouvelles: 22 },
      { mois: 'Jun', nouvelles: 14 }
    ];
  }
}
