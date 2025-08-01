import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interface simplifiée pour éviter les conflits
export interface FamilleSimple {
  id: string;
  nomFamille: string;
  nombreMembres: number;
  adresse: {
    quartier: string;
  };
  membres: Array<{
    sexe: 'M' | 'F';
    dateNaissance: Date;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class FamilleSimpleService {
  private mockFamilles: FamilleSimple[] = [
    {
      id: '1',
      nomFamille: 'Kouassi',
      nombreMembres: 4,
      adresse: { quartier: 'Plateau Centre' },
      membres: [
        { sexe: 'M', dateNaissance: new Date('1980-05-15') },
        { sexe: 'F', dateNaissance: new Date('1985-03-20') },
        { sexe: 'M', dateNaissance: new Date('2010-08-12') },
        { sexe: 'F', dateNaissance: new Date('2015-12-05') }
      ]
    },
    {
      id: '2',
      nomFamille: 'Diallo',
      nombreMembres: 3,
      adresse: { quartier: 'Pateau Nord Centre' },
      membres: [
        { sexe: 'M', dateNaissance: new Date('1975-11-08') },
        { sexe: 'F', dateNaissance: new Date('1978-06-25') },
        { sexe: 'F', dateNaissance: new Date('2012-02-14') }
      ]
    }
  ];

  private famillesSubject = new BehaviorSubject<FamilleSimple[]>(this.mockFamilles);

  public familles$ = this.famillesSubject.asObservable();

  getFamilles(): Observable<FamilleSimple[]> {
    return this.familles$;
  }
}
