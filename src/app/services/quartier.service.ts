import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Quartier, Projet } from '../models/quartier.model';
import { ProjetService } from './projet.service';

@Injectable({
  providedIn: 'root'
})
export class QuartierService {
  private quartiersSubject = new BehaviorSubject<Quartier[]>([]);
  public quartiers$ = this.quartiersSubject.asObservable();

  // Données mockées enrichies
  private mockQuartiers: Quartier[] = [
    {
      id: '1',
      nom: 'Plateau Centre',
      description: 'Cœur administratif et commercial du Plateau',
      coordonnees: { latitude: 5.3197, longitude: -4.0250 },
      superficie: 2.5,
      population: 15000,
      nombreFamilles: 3200,
      nombreMenages: 3800,
      chef: {
        nom: 'Kouassi',
        prenoms: 'Jean-Baptiste',
        telephone: '+225 01 02 03 04 05',
        email: 'chef.plateau-centre@plateau.ci'
      },
      infrastructures: {
        ecoles: 8,
        centres_sante: 3,
        marches: 2,
        lieux_culte: 12,
        terrains_sport: 4
      },
      services: {
        eau_courante: 95,
        electricite: 98,
        assainissement: 85,
        internet: 75,
        transport_public: 90
      },
      projets: [],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    },
    {
      id: '2',
      nom: 'Plateau Nord',
      description: 'Zone résidentielle et universitaire',
      coordonnees: { latitude: 5.3250, longitude: -4.0200 },
      superficie: 3.2,
      population: 12000,
      nombreFamilles: 2600,
      nombreMenages: 3100,
      chef: {
        nom: 'Diabaté',
        prenoms: 'Mariam',
        telephone: '+225 07 08 09 10 11',
        email: 'chef.plateau-nord@plateau.ci'
      },
      infrastructures: {
        ecoles: 6,
        centres_sante: 2,
        marches: 1,
        lieux_culte: 8,
        terrains_sport: 3
      },
      services: {
        eau_courante: 90,
        electricite: 95,
        assainissement: 80,
        internet: 70,
        transport_public: 85
      },
      projets: [],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date()
    },
    {
      id: '3',
      nom: 'Plateau Sud',
      description: 'Zone mixte résidentielle et commerciale',
      coordonnees: { latitude: 5.3150, longitude: -4.0275 },
      superficie: 2.8,
      population: 18000,
      nombreFamilles: 4100,
      nombreMenages: 4800,
      chef: {
        nom: 'Ouattara',
        prenoms: 'Ibrahim',
        telephone: '+225 05 06 07 08 09',
        email: 'chef.plateau-sud@plateau.ci'
      },
      infrastructures: {
        ecoles: 10,
        centres_sante: 4,
        marches: 3,
        lieux_culte: 15,
        terrains_sport: 5
      },
      services: {
        eau_courante: 88,
        electricite: 92,
        assainissement: 75,
        internet: 65,
        transport_public: 80
      },
      projets: [],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date()
    },
    {
      id: '4',
      nom: 'Plateau Est',
      description: 'Zone en développement avec nouveaux projets',
      coordonnees: { latitude: 5.3180, longitude: -4.0180 },
      superficie: 4.1,
      population: 8500,
      nombreFamilles: 1900,
      nombreMenages: 2200,
      chef: {
        nom: 'Bamba',
        prenoms: 'Fatou',
        telephone: '+225 03 04 05 06 07',
        email: 'chef.plateau-est@plateau.ci'
      },
      infrastructures: {
        ecoles: 4,
        centres_sante: 1,
        marches: 1,
        lieux_culte: 6,
        terrains_sport: 2
      },
      services: {
        eau_courante: 70,
        electricite: 85,
        assainissement: 60,
        internet: 50,
        transport_public: 65
      },
      projets: [],
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date()
    }
  ];

  constructor() {
    this.quartiersSubject.next(this.mockQuartiers);
  }

  getAll(): Observable<Quartier[]> {
    return of(this.mockQuartiers).pipe(delay(500));
  }

  getById(id: string): Observable<Quartier | undefined> {
    return of(this.mockQuartiers.find(q => q.id === id)).pipe(delay(300));
  }

  create(quartier: Omit<Quartier, 'id' | 'createdAt' | 'updatedAt'>): Observable<Quartier> {
    const newQuartier: Quartier = {
      ...quartier,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockQuartiers.push(newQuartier);
    this.quartiersSubject.next([...this.mockQuartiers]);
    
    return of(newQuartier).pipe(delay(300));
  }

  update(id: string, updates: Partial<Quartier>): Observable<Quartier> {
    const index = this.mockQuartiers.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Quartier non trouvé');
    }

    const updatedQuartier = {
      ...this.mockQuartiers[index],
      ...updates,
      updatedAt: new Date()
    };

    this.mockQuartiers[index] = updatedQuartier;
    this.quartiersSubject.next([...this.mockQuartiers]);
    
    return of(updatedQuartier).pipe(delay(300));
  }

  delete(id: string): Observable<boolean> {
    const index = this.mockQuartiers.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Quartier non trouvé');
    }

    this.mockQuartiers.splice(index, 1);
    this.quartiersSubject.next([...this.mockQuartiers]);
    
    return of(true).pipe(delay(300));
  }

  // Méthodes CRUD supplémentaires pour la compatibilité
  getAllQuartiers(): Observable<Quartier[]> {
    return this.getAll();
  }

  searchQuartiers(searchTerm: string): Observable<Quartier[]> {
    return this.getAll().pipe(
      map((quartiers: Quartier[]) => 
        quartiers.filter((quartier: Quartier) => 
          quartier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quartier.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quartier.chef?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quartier.chef?.prenoms.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  createQuartier(quartier: Omit<Quartier, 'id' | 'createdAt' | 'updatedAt'>): Observable<Quartier> {
    return this.create(quartier);
  }

  updateQuartier(id: string, updates: Partial<Quartier>): Observable<Quartier> {
    return this.update(id, updates);
  }

  deleteQuartier(id: string): Observable<boolean> {
    return this.delete(id);
  }

  getStatistiques(): Observable<any> {
    return of({
      total: this.mockQuartiers.length,
      populationTotale: this.mockQuartiers.reduce((sum, q) => sum + q.population, 0),
      famillesTotales: this.mockQuartiers.reduce((sum, q) => sum + q.nombreFamilles, 0),
      superficieTotale: this.mockQuartiers.reduce((sum, q) => sum + q.superficie, 0),
      moyenneServices: {
        eau_courante: Math.round(this.mockQuartiers.reduce((sum, q) => sum + (q.services?.eau_courante || 0), 0) / this.mockQuartiers.length),
        electricite: Math.round(this.mockQuartiers.reduce((sum, q) => sum + (q.services?.electricite || 0), 0) / this.mockQuartiers.length),
        assainissement: Math.round(this.mockQuartiers.reduce((sum, q) => sum + (q.services?.assainissement || 0), 0) / this.mockQuartiers.length),
        internet: Math.round(this.mockQuartiers.reduce((sum, q) => sum + (q.services?.internet || 0), 0) / this.mockQuartiers.length),
        transport_public: Math.round(this.mockQuartiers.reduce((sum, q) => sum + (q.services?.transport_public || 0), 0) / this.mockQuartiers.length)
      }
    }).pipe(delay(400));
  }
}
