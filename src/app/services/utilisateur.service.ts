import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(this.getMockUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  getCurrentUser(): Observable<Utilisateur | null> {
    return this.currentUser$;
  }

  updateProfile(userData: Partial<Utilisateur>): Observable<Utilisateur> {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser: Utilisateur = {
        ...currentUser,
        ...userData
      };
      this.currentUserSubject.next(updatedUser);
      return of(updatedUser).pipe(delay(500));
    }
    throw new Error('Aucun utilisateur connecté');
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    // Simulation de la mise à jour du mot de passe
    return of(true).pipe(delay(1000));
  }

  updatePreferences(preferences: any): Observable<boolean> {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser: Utilisateur = {
        ...currentUser,
        preferences: { ...currentUser.preferences, ...preferences }
      };
      this.currentUserSubject.next(updatedUser);
      return of(true).pipe(delay(500));
    }
    return of(false);
  }

  uploadAvatar(file: File): Observable<string> {
    // Simulation de l'upload d'avatar
    const mockUrl = 'https://via.placeholder.com/150';
    return of(mockUrl).pipe(delay(1500));
  }

  private getMockUser(): Utilisateur {
    return {
      id: '1',
      nom: 'Kouassi',
      prenoms: 'Jean-Baptiste',
      email: 'j.kouassi@gestion-pop.ci',
      telephone: '+225 07 12 34 56 78',
      role: 'Admin',
      statut: 'Actif',
      dateCreation: new Date('2024-01-15'),
      derniereConnexion: new Date(),
      avatar: 'https://via.placeholder.com/150',
      preferences: {
        langue: 'fr',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    };
  }
}
