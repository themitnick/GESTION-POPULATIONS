import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Famille, Membre, Adresse } from '../models/famille.model';

@Injectable({
  providedIn: 'root'
})
export class FamilleService {
  private famillesSubject = new BehaviorSubject<Famille[]>([]);
  public familles$ = this.famillesSubject.asObservable();

  private mockFamilles: Famille[] = [
    {
      id: '1',
      nomFamille: 'KONE',
      adresse: {
        rue: 'Rue 12, Lot 45',
        quartier: 'Pateau Nord',
        codePostal: '01',
        ville: 'Abidjan',
        coordonnees: { latitude: 5.3364, longitude: -4.0267 }
      },
      chefFamille: {
        id: '1',
        nom: 'KONE',
        prenoms: 'Kouassi Jean',
        sexe: 'M',
        dateNaissance: new Date('1980-05-15'),
        lieuNaissance: 'Abidjan',
        nationalite: 'Ivoirienne',
        profession: 'Fonctionnaire',
        niveauEtude: 'Supérieur',
        situationMatrimoniale: 'Marié',
        numeroIdentite: 'CI1234567890',
        telephone: '+225 07 12 34 56 78',
        email: 'kone.jean@email.ci',
        estChefFamille: true,
        estActif: true,
        dateEnregistrement: new Date('2024-01-15'),
        dateMiseAJour: new Date(),
        observations: 'Chef de famille actif'
      },
      membres: [
        {
          id: '1',
          nom: 'KONE',
          prenoms: 'Kouassi Jean',
          sexe: 'M',
          dateNaissance: new Date('1980-05-15'),
          lieuNaissance: 'Abidjan',
          nationalite: 'Ivoirienne',
          profession: 'Fonctionnaire',
          niveauEtude: 'Supérieur',
          situationMatrimoniale: 'Marié',
          numeroIdentite: 'CI1234567890',
          telephone: '+225 07 12 34 56 78',
          email: 'kone.jean@email.ci',
          estChefFamille: true,
          estActif: true,
          dateEnregistrement: new Date('2024-01-15'),
          dateMiseAJour: new Date(),
          observations: 'Chef de famille'
        },
        {
          id: '2',
          nom: 'KONE',
          prenoms: 'Aya Marie',
          sexe: 'F',
          dateNaissance: new Date('1985-08-22'),
          lieuNaissance: 'Bouaké',
          nationalite: 'Ivoirienne',
          profession: 'Commerçante',
          niveauEtude: 'Secondaire',
          situationMatrimoniale: 'Marié',
          numeroIdentite: 'CI0987654321',
          telephone: '+225 05 98 76 54 32',
          estChefFamille: false,
          estActif: true,
          dateEnregistrement: new Date('2024-01-15'),
          dateMiseAJour: new Date()
        }
      ],
      nombreMembres: 2,
      revenusEstimes: 450000,
      typeLogement: 'Propriétaire',
      sourceEau: 'Robinet',
      sourceElectricite: 'CIE',
      evacuationEaux: 'Réseau public',
      numeroCompte: 'FAM001',
      dateCreation: new Date('2024-01-15'),
      dateEnregistrement: new Date('2024-01-15'),
      dateMiseAJour: new Date(),
      statutValidation: 'Validé'
    },
    {
      id: '2',
      nomFamille: 'OUATTARA',
      adresse: {
        rue: 'Avenue 7, Résidence Belle Vue',
        quartier: 'Plateau',
        codePostal: '01',
        ville: 'Abidjan',
        coordonnees: { latitude: 5.3198, longitude: -4.0267 }
      },
      chefFamille: {
        id: '3',
        nom: 'OUATTARA',
        prenoms: 'Ibrahim',
        sexe: 'M',
        dateNaissance: new Date('1975-12-03'),
        lieuNaissance: 'Korhogo',
        nationalite: 'Ivoirienne',
        profession: 'Ingénieur',
        niveauEtude: 'Supérieur',
        situationMatrimoniale: 'Marié',
        numeroIdentite: 'CI5555666677',
        telephone: '+225 01 23 45 67 89',
        estChefFamille: true,
        estActif: true,
        dateEnregistrement: new Date('2024-02-01'),
        dateMiseAJour: new Date()
      },
      membres: [
        {
          id: '3',
          nom: 'OUATTARA',
          prenoms: 'Ibrahim',
          sexe: 'M',
          dateNaissance: new Date('1975-12-03'),
          lieuNaissance: 'Korhogo',
          nationalite: 'Ivoirienne',
          profession: 'Ingénieur',
          niveauEtude: 'Supérieur',
          situationMatrimoniale: 'Marié',
          numeroIdentite: 'CI5555666677',
          telephone: '+225 01 23 45 67 89',
          estChefFamille: true,
          estActif: true,
          dateEnregistrement: new Date('2024-02-01'),
          dateMiseAJour: new Date()
        }
      ],
      nombreMembres: 1,
      revenusEstimes: 750000,
      typeLogement: 'Locataire',
      sourceEau: 'Robinet',
      sourceElectricite: 'CIE',
      evacuationEaux: 'Réseau public',
      numeroCompte: 'FAM002',
      dateCreation: new Date('2024-02-01'),
      dateEnregistrement: new Date('2024-02-01'),
      dateMiseAJour: new Date(),
      statutValidation: 'Validé'
    }
  ];

  constructor() {
    this.famillesSubject.next(this.mockFamilles);
  }

  // CREATE - Créer une nouvelle famille
  createFamille(famille: Omit<Famille, 'id' | 'dateEnregistrement' | 'dateMiseAJour'>): Observable<Famille> {
    return of(famille).pipe(
      delay(500),
      map(nouvelleFamille => {
        const familleComplete: Famille = {
          ...nouvelleFamille,
          id: this.generateId(),
          dateEnregistrement: new Date(),
          dateMiseAJour: new Date()
        };
        
        const familles = this.famillesSubject.value;
        familles.push(familleComplete);
        this.famillesSubject.next([...familles]);
        
        return familleComplete;
      })
    );
  }

  // READ - Obtenir toutes les familles
  getAllFamilles(): Observable<Famille[]> {
    return this.familles$.pipe(delay(300));
  }

  // READ - Obtenir une famille par ID
  getFamilleById(id: string): Observable<Famille | null> {
    return this.familles$.pipe(
      delay(200),
      map(familles => familles.find(f => f.id === id) || null)
    );
  }

  // READ - Rechercher des familles
  searchFamilles(criteres: {
    nom?: string;
    quartier?: string;
    statut?: string;
  }): Observable<Famille[]> {
    return this.familles$.pipe(
      delay(300),
      map(familles => {
        return familles.filter(famille => {
          let matches = true;
          
          if (criteres.nom) {
            matches = matches && famille.nomFamille.toLowerCase().includes(criteres.nom.toLowerCase());
          }
          
          if (criteres.quartier) {
            matches = matches && famille.adresse.quartier.toLowerCase().includes(criteres.quartier.toLowerCase());
          }
          
          if (criteres.statut) {
            matches = matches && famille.statutValidation === criteres.statut;
          }
          
          return matches;
        });
      })
    );
  }

  // UPDATE - Modifier une famille
  updateFamille(id: string, famille: Partial<Famille>): Observable<Famille> {
    return of(famille).pipe(
      delay(500),
      map(modifications => {
        const familles = this.famillesSubject.value;
        const index = familles.findIndex(f => f.id === id);
        
        if (index === -1) {
          throw new Error('Famille non trouvée');
        }
        
        const familleModifiee: Famille = {
          ...familles[index],
          ...modifications,
          id, // Préserver l'ID
          dateMiseAJour: new Date()
        };
        
        familles[index] = familleModifiee;
        this.famillesSubject.next([...familles]);
        
        return familleModifiee;
      })
    );
  }

  // DELETE - Supprimer une famille
  deleteFamille(id: string): Observable<boolean> {
    return of(id).pipe(
      delay(300),
      map(() => {
        const familles = this.famillesSubject.value;
        const index = familles.findIndex(f => f.id === id);
        
        if (index === -1) {
          throw new Error('Famille non trouvée');
        }
        
        familles.splice(index, 1);
        this.famillesSubject.next([...familles]);
        
        return true;
      })
    );
  }

  // MEMBRE CRUD
  // Ajouter un membre à une famille
  addMembreToFamille(familleId: string, membre: Omit<Membre, 'id' | 'dateEnregistrement' | 'dateMiseAJour'>): Observable<Membre> {
    return of(membre).pipe(
      delay(500),
      map(nouveauMembre => {
        const familles = this.famillesSubject.value;
        const famille = familles.find(f => f.id === familleId);
        
        if (!famille) {
          throw new Error('Famille non trouvée');
        }
        
        const membreComplet: Membre = {
          ...nouveauMembre,
          id: this.generateId(),
          dateEnregistrement: new Date(),
          dateMiseAJour: new Date()
        };
        
        famille.membres.push(membreComplet);
        famille.nombreMembres = famille.membres.length;
        famille.dateMiseAJour = new Date();
        
        this.famillesSubject.next([...familles]);
        
        return membreComplet;
      })
    );
  }

  // Modifier un membre
  updateMembre(familleId: string, membreId: string, modifications: Partial<Membre>): Observable<Membre> {
    return of(modifications).pipe(
      delay(500),
      map(modifs => {
        const familles = this.famillesSubject.value;
        const famille = familles.find(f => f.id === familleId);
        
        if (!famille) {
          throw new Error('Famille non trouvée');
        }
        
        const membreIndex = famille.membres.findIndex(m => m.id === membreId);
        if (membreIndex === -1) {
          throw new Error('Membre non trouvé');
        }
        
        const membreModifie: Membre = {
          ...famille.membres[membreIndex],
          ...modifs,
          id: membreId,
          dateMiseAJour: new Date()
        };
        
        famille.membres[membreIndex] = membreModifie;
        famille.dateMiseAJour = new Date();
        
        // Mettre à jour le chef de famille si nécessaire
        if (membreModifie.estChefFamille) {
          famille.chefFamille = membreModifie;
        }
        
        this.famillesSubject.next([...familles]);
        
        return membreModifie;
      })
    );
  }

  // Supprimer un membre
  deleteMembre(familleId: string, membreId: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        const familles = this.famillesSubject.value;
        const famille = familles.find(f => f.id === familleId);
        
        if (!famille) {
          throw new Error('Famille non trouvée');
        }
        
        const membreIndex = famille.membres.findIndex(m => m.id === membreId);
        if (membreIndex === -1) {
          throw new Error('Membre non trouvé');
        }
        
        // Ne pas permettre la suppression du chef de famille s'il y a d'autres membres
        const membre = famille.membres[membreIndex];
        if (membre.estChefFamille && famille.membres.length > 1) {
          throw new Error('Impossible de supprimer le chef de famille. Désignez d\'abord un nouveau chef.');
        }
        
        famille.membres.splice(membreIndex, 1);
        famille.nombreMembres = famille.membres.length;
        famille.dateMiseAJour = new Date();
        
        this.famillesSubject.next([...familles]);
        
        return true;
      })
    );
  }

  // Obtenir les statistiques des familles
  getStatistiquesFamilles(): Observable<any> {
    return this.familles$.pipe(
      delay(200),
      map(familles => {
        const totalFamilles = familles.length;
        const totalMembres = familles.reduce((sum, f) => sum + f.nombreMembres, 0);
        const famillesValidees = familles.filter(f => f.statutValidation === 'Validé').length;
        const revenusTotal = familles.reduce((sum, f) => sum + (f.revenusEstimes || 0), 0);
        const revenuMoyen = totalFamilles > 0 ? revenusTotal / totalFamilles : 0;
        
        // Répartition par quartier
        const repartitionQuartier = familles.reduce((acc: any, f) => {
          const quartier = f.adresse.quartier;
          acc[quartier] = (acc[quartier] || 0) + 1;
          return acc;
        }, {});
        
        // Répartition par type de logement
        const repartitionLogement = familles.reduce((acc: any, f) => {
          const type = f.typeLogement || 'Non spécifié';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});
        
        return {
          totalFamilles,
          totalMembres,
          famillesValidees,
          pourcentageValidation: totalFamilles > 0 ? (famillesValidees / totalFamilles) * 100 : 0,
          revenuMoyen,
          repartitionQuartier,
          repartitionLogement
        };
      })
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
