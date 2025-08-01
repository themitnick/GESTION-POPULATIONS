import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Données mockées
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@plateau.ci',
      password: 'admin123',
      role: 'admin',
      firstName: 'Kouassi',
      lastName: 'Adjoua',
      phone: '+225 01 02 03 04 05',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: '2',
      username: 'agent1',
      email: 'agent1@plateau.ci',
      password: 'agent123',
      role: 'agent',
      firstName: 'Koffi',
      lastName: 'Brou',
      phone: '+225 05 06 07 08 09',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    },
    {
      id: '3',
      username: 'consultant',
      email: 'consultant@plateau.ci',
      password: 'consultant123',
      role: 'consultant',
      firstName: 'Aya',
      lastName: 'Diabaté',
      phone: '+225 07 08 09 10 11',
      isActive: true,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date()
    }
  ];

  constructor() {
    // Vérifier si l'utilisateur est déjà connecté
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return of(credentials).pipe(
      delay(1000), // Simuler un délai réseau
      map(creds => {
        const user = this.mockUsers.find(u => 
          u.username === creds.username && u.password === creds.password
        );
        
        if (!user) {
          throw new Error('Identifiants invalides');
        }

        if (!user.isActive) {
          throw new Error('Compte désactivé');
        }

        const { password, ...userWithoutPassword } = user;
        const authResponse: AuthResponse = {
          user: userWithoutPassword,
          token: this.generateMockToken(),
          refreshToken: this.generateMockToken(),
          expiresIn: 3600
        };

        // Sauvegarder l'utilisateur connecté
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem('authToken', authResponse.token);
        
        this.currentUserSubject.next(userWithoutPassword);
        this.isAuthenticatedSubject.next(true);

        return authResponse;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  canAccess(requiredRoles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? requiredRoles.includes(user.role) : false;
  }

  private generateMockToken(): string {
    return 'mock_token_' + Math.random().toString(36).substr(2, 9);
  }

  // Gestion des utilisateurs (pour admin)
  getUsers(): Observable<User[]> {
    return of(this.mockUsers.map(({ password, ...user }) => user)).pipe(delay(500));
  }

  createUser(userData: Partial<User>): Observable<User> {
    const newUser: User = {
      id: (this.mockUsers.length + 1).toString(),
      username: userData.username!,
      email: userData.email!,
      role: userData.role!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      phone: userData.phone,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockUsers.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return of(userWithoutPassword).pipe(delay(500));
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    const userIndex = this.mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return throwError(() => new Error('Utilisateur introuvable'));
    }

    this.mockUsers[userIndex] = {
      ...this.mockUsers[userIndex],
      ...userData,
      updatedAt: new Date()
    };

    const { password, ...userWithoutPassword } = this.mockUsers[userIndex];
    return of(userWithoutPassword).pipe(delay(500));
  }

  deleteUser(id: string): Observable<boolean> {
    const userIndex = this.mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return throwError(() => new Error('Utilisateur introuvable'));
    }

    this.mockUsers.splice(userIndex, 1);
    return of(true).pipe(delay(500));
  }
}
