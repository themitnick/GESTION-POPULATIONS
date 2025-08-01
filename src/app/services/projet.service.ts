import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Projet, IndicateurProjet } from '../models/quartier.model';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private projetsSubject = new BehaviorSubject<Projet[]>([]);
  public projets$ = this.projetsSubject.asObservable();

  // Données mockées enrichies
  private mockProjets: Projet[] = [
    {
      id: 'proj-1',
      quartierId: '1',
      nom: 'Réhabilitation du marché central',
      description: 'Modernisation et extension du marché central du Plateau',
      type: 'infrastructure',
      statut: 'en-cours',
      budget: 85000000,
      budgetDepense: 45000000,
      dateDebut: new Date('2024-03-01'),
      dateFinPrevue: new Date('2024-12-31'),
      responsable: 'Direction des Travaux Publics',
      beneficiaires: 8500,
      description_detaillee: 'Projet de réhabilitation complète incluant la construction de nouveaux étals, l\'installation d\'un système d\'évacuation moderne et l\'amélioration de l\'éclairage.',
      objectifs: [
        'Améliorer les conditions de vente',
        'Augmenter la capacité d\'accueil',
        'Moderniser les infrastructures'
      ],
      indicateurs: [
        {
          id: 'ind-1',
          nom: 'Nombre d\'étals réhabilités',
          description: 'Étals modernisés et fonctionnels',
          unite: 'unité',
          valeurCible: 120,
          valeurActuelle: 65,
          pourcentageRealisation: 54,
          dateEvaluation: new Date()
        }
      ],
      dateCreation: new Date('2024-01-15'),
      dateModification: new Date()
    },
    {
      id: 'proj-2',
      quartierId: '1',
      nom: 'Programme d\'alphabétisation',
      description: 'Formation en alphabétisation pour les adultes',
      type: 'social',
      statut: 'en-cours',
      budget: 12000000,
      budgetDepense: 8000000,
      dateDebut: new Date('2024-02-15'),
      dateFinPrevue: new Date('2024-11-30'),
      responsable: 'Service Social Municipal',
      beneficiaires: 200,
      description_detaillee: 'Programme d\'alphabétisation en français et en langues locales pour les adultes non scolarisés.',
      objectifs: [
        'Réduire l\'analphabétisme',
        'Améliorer l\'employabilité',
        'Renforcer la cohésion sociale'
      ],
      indicateurs: [
        {
          id: 'ind-2',
          nom: 'Nombre de participants formés',
          description: 'Adultes ayant terminé le programme',
          unite: 'personne',
          valeurCible: 200,
          valeurActuelle: 135,
          pourcentageRealisation: 68,
          dateEvaluation: new Date()
        }
      ],
      dateCreation: new Date('2024-01-20'),
      dateModification: new Date()
    },
    {
      id: 'proj-3',
      quartierId: '2',
      nom: 'Création d\'un centre de santé',
      description: 'Construction d\'un nouveau centre de santé communautaire',
      type: 'infrastructure',
      statut: 'planifie',
      budget: 120000000,
      budgetDepense: 0,
      dateDebut: new Date('2024-09-01'),
      dateFinPrevue: new Date('2025-08-31'),
      responsable: 'Ministère de la Santé',
      beneficiaires: 12000,
      description_detaillee: 'Construction d\'un centre de santé moderne avec maternité, laboratoire et pharmacie.',
      objectifs: [
        'Améliorer l\'accès aux soins',
        'Réduire la mortalité infantile',
        'Rapprocher les services de santé'
      ],
      indicateurs: [
        {
          id: 'ind-3',
          nom: 'Avancement des travaux',
          description: 'Pourcentage de construction réalisée',
          unite: 'pourcentage',
          valeurCible: 100,
          valeurActuelle: 0,
          pourcentageRealisation: 0,
          dateEvaluation: new Date()
        }
      ],
      dateCreation: new Date('2024-03-01'),
      dateModification: new Date()
    },
    {
      id: 'proj-4',
      quartierId: '3',
      nom: 'Microfinance pour femmes',
      description: 'Programme de microcrédits pour entrepreneures',
      type: 'economique',
      statut: 'en-cours',
      budget: 25000000,
      budgetDepense: 15000000,
      dateDebut: new Date('2024-01-01'),
      dateFinPrevue: new Date('2024-12-31'),
      responsable: 'Direction du Développement Économique',
      beneficiaires: 150,
      description_detaillee: 'Programme de microcrédits accompagné de formations en gestion d\'entreprise.',
      objectifs: [
        'Promouvoir l\'entrepreneuriat féminin',
        'Créer des emplois',
        'Améliorer les revenus des ménages'
      ],
      indicateurs: [
        {
          id: 'ind-4',
          nom: 'Nombre de crédits accordés',
          description: 'Microcrédits distribués aux bénéficiaires',
          unite: 'unité',
          valeurCible: 150,
          valeurActuelle: 95,
          pourcentageRealisation: 63,
          dateEvaluation: new Date()
        }
      ],
      dateCreation: new Date('2023-12-01'),
      dateModification: new Date()
    },
    {
      id: 'proj-5',
      quartierId: '3',
      nom: 'Reboisement urbain',
      description: 'Plantation d\'arbres dans les espaces publics',
      type: 'environnement',
      statut: 'termine',
      budget: 8000000,
      budgetDepense: 7500000,
      dateDebut: new Date('2023-10-01'),
      dateFin: new Date('2024-03-31'),
      dateFinPrevue: new Date('2024-03-31'),
      responsable: 'Service Environnement',
      beneficiaires: 18000,
      description_detaillee: 'Plantation de 500 arbres fruitiers et d\'ombrage dans les espaces publics du quartier.',
      objectifs: [
        'Améliorer la qualité de l\'air',
        'Créer de l\'ombre',
        'Embellir le quartier'
      ],
      indicateurs: [
        {
          id: 'ind-5',
          nom: 'Nombre d\'arbres plantés',
          description: 'Arbres plantés et survivants',
          unite: 'unité',
          valeurCible: 500,
          valeurActuelle: 480,
          pourcentageRealisation: 96,
          dateEvaluation: new Date()
        }
      ],
      dateCreation: new Date('2023-09-01'),
      dateModification: new Date()
    },
    {
      id: 'proj-6',
      quartierId: '4',
      nom: 'Éclairage public solaire',
      description: 'Installation de lampadaires solaires',
      type: 'infrastructure',
      statut: 'en-cours',
      budget: 35000000,
      budgetDepense: 20000000,
      dateDebut: new Date('2024-04-01'),
      dateFinPrevue: new Date('2024-10-31'),
      responsable: 'Service Électricité Municipale',
      beneficiaires: 8500,
      description_detaillee: 'Installation de 80 lampadaires solaires le long des principales artères du quartier.',
      objectifs: [
        'Améliorer la sécurité nocturne',
        'Utiliser l\'énergie renouvelable',
        'Réduire les coûts d\'électricité'
      ],
      indicateurs: [
        {
          id: 'ind-6',
          nom: 'Nombre de lampadaires installés',
          description: 'Lampadaires solaires fonctionnels',
          unite: 'unité',
          valeurCible: 80,
          valeurActuelle: 45,
          pourcentageRealisation: 56,
          dateEvaluation: new Date()
        }
      ],
      dateCreation: new Date('2024-02-15'),
      dateModification: new Date()
    }
  ];

  constructor() {
    this.projetsSubject.next(this.mockProjets);
  }

  getAll(): Observable<Projet[]> {
    return of(this.mockProjets).pipe(delay(500));
  }

  getById(id: string): Observable<Projet | undefined> {
    return of(this.mockProjets.find(p => p.id === id)).pipe(delay(300));
  }

  getByQuartier(quartierId: string): Observable<Projet[]> {
    return of(this.mockProjets.filter(p => p.quartierId === quartierId)).pipe(delay(300));
  }

  create(projet: Omit<Projet, 'id' | 'dateCreation' | 'dateModification'>): Observable<Projet> {
    const newProjet: Projet = {
      ...projet,
      id: `proj-${Date.now()}`,
      dateCreation: new Date(),
      dateModification: new Date()
    };

    this.mockProjets.push(newProjet);
    this.projetsSubject.next([...this.mockProjets]);
    
    return of(newProjet).pipe(delay(300));
  }

  update(id: string, updates: Partial<Projet>): Observable<Projet> {
    const index = this.mockProjets.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Projet non trouvé');
    }

    const updatedProjet = {
      ...this.mockProjets[index],
      ...updates,
      dateModification: new Date()
    };

    this.mockProjets[index] = updatedProjet;
    this.projetsSubject.next([...this.mockProjets]);
    
    return of(updatedProjet).pipe(delay(300));
  }

  delete(id: string): Observable<boolean> {
    const index = this.mockProjets.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Projet non trouvé');
    }

    this.mockProjets.splice(index, 1);
    this.projetsSubject.next([...this.mockProjets]);
    
    return of(true).pipe(delay(300));
  }

  getStatistiques(): Observable<any> {
    const total = this.mockProjets.length;
    const enCours = this.mockProjets.filter(p => p.statut === 'en-cours').length;
    const termines = this.mockProjets.filter(p => p.statut === 'termine').length;
    const planifies = this.mockProjets.filter(p => p.statut === 'planifie').length;
    
    return of({
      total,
      enCours,
      termines,
      planifies,
      budgetTotal: this.mockProjets.reduce((sum, p) => sum + p.budget, 0),
      budgetDepense: this.mockProjets.reduce((sum, p) => sum + p.budgetDepense, 0),
      beneficiairesTotaux: this.mockProjets.reduce((sum, p) => sum + p.beneficiaires, 0),
      repartitionParType: {
        infrastructure: this.mockProjets.filter(p => p.type === 'infrastructure').length,
        social: this.mockProjets.filter(p => p.type === 'social').length,
        economique: this.mockProjets.filter(p => p.type === 'economique').length,
        environnement: this.mockProjets.filter(p => p.type === 'environnement').length,
        securite: this.mockProjets.filter(p => p.type === 'securite').length
      }
    }).pipe(delay(400));
  }

  // Méthodes CRUD supplémentaires pour la compatibilité
  ajouterProjet(projet: Omit<Projet, 'id' | 'dateCreation' | 'dateModification'>): Observable<Projet> {
    return this.create(projet);
  }

  modifierProjet(id: string, updates: Partial<Projet>): Observable<Projet> {
    return this.update(id, updates);
  }

  supprimerProjet(id: string): Observable<boolean> {
    return this.delete(id);
  }
}
