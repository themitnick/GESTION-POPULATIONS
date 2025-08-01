import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>(this.getMockNotifications());
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  getAllNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        observer.next(notifications.filter(n => !n.isRead && !n.isArchived));
      });
    });
  }

  getUnreadCount(): Observable<number> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        observer.next(notifications.filter(n => !n.isRead && !n.isArchived).length);
      });
    });
  }

  markAsRead(notificationId: string): Observable<boolean> {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.notificationsSubject.next([...notifications]);
    }
    return of(true).pipe(delay(300));
  }

  markAllAsRead(): Observable<boolean> {
    const notifications = this.notificationsSubject.value;
    notifications.forEach(n => {
      if (!n.isArchived) {
        n.isRead = true;
      }
    });
    this.notificationsSubject.next([...notifications]);
    return of(true).pipe(delay(500));
  }

  archiveNotification(notificationId: string): Observable<boolean> {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isArchived = true;
      notification.isRead = true;
    }
    this.notificationsSubject.next([...notifications]);
    return of(true).pipe(delay(300));
  }

  deleteNotification(notificationId: string): Observable<boolean> {
    const notifications = this.notificationsSubject.value;
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      notifications.splice(index, 1);
      this.notificationsSubject.next([...notifications]);
    }
    return of(true).pipe(delay(300));
  }

  createNotification(notification: Omit<Notification, 'id' | 'dateCreation' | 'isRead' | 'isArchived'>): Observable<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      dateCreation: new Date(),
      isRead: false,
      isArchived: false
    };
    
    const notifications = this.notificationsSubject.value;
    notifications.unshift(newNotification);
    this.notificationsSubject.next([...notifications]);
    
    return of(newNotification).pipe(delay(300));
  }

  // Méthodes pour filtrer les notifications
  getNotificationsByType(type: string): Observable<Notification[]> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        observer.next(notifications.filter(n => n.type === type && !n.isArchived));
      });
    });
  }

  getNotificationsByPriority(priority: string): Observable<Notification[]> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        observer.next(notifications.filter(n => n.priority === priority && !n.isArchived));
      });
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getMockNotifications(): Notification[] {
    return [
      {
        id: '1',
        type: 'info',
        title: 'Nouvelle famille enregistrée',
        message: 'La famille Kouassi a été enregistrée avec succès dans le quartier Plateau.',
        dateCreation: new Date('2025-08-01T09:30:00'),
        isRead: false,
        isArchived: false,
        priority: 'medium',
        source: 'Système',
        actionUrl: '/familles/1'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Mise à jour requise',
        message: 'Plusieurs familles du quartier Pateau Nord n\'ont pas été mises à jour depuis 6 mois.',
        dateCreation: new Date('2025-08-01T08:15:00'),
        isRead: false,
        isArchived: false,
        priority: 'high',
        source: 'Système',
        actionUrl: '/familles?quartier=Pateau Nord'
      },
      {
        id: '3',
        type: 'success',
        title: 'Rapport généré',
        message: 'Le rapport mensuel des statistiques a été généré avec succès.',
        dateCreation: new Date('2025-08-01T07:00:00'),
        isRead: true,
        isArchived: false,
        priority: 'low',
        source: 'Système',
        actionUrl: '/dashboard'
      },
      {
        id: '4',
        type: 'error',
        title: 'Erreur de synchronisation',
        message: 'La synchronisation avec la base de données externe a échoué.',
        dateCreation: new Date('2025-07-31T18:45:00'),
        isRead: false,
        isArchived: false,
        priority: 'high',
        source: 'Système'
      },
      {
        id: '5',
        type: 'info',
        title: 'Nouveau projet créé',
        message: 'Le projet "Électrification rurale" a été créé pour le quartier Pateau Centre.',
        dateCreation: new Date('2025-07-31T16:20:00'),
        isRead: true,
        isArchived: false,
        priority: 'medium',
        source: 'Utilisateur',
        actionUrl: '/projets/5'
      },
      {
        id: '6',
        type: 'warning',
        title: 'Sauvegarde manquée',
        message: 'La sauvegarde automatique programmée pour hier soir a échoué.',
        dateCreation: new Date('2025-07-31T10:00:00'),
        isRead: false,
        isArchived: false,
        priority: 'high',
        source: 'Système',
        actionUrl: '/parametres#backup'
      },
      {
        id: '7',
        type: 'info',
        title: 'Utilisateur connecté',
        message: 'L\'agent Marie Diallo s\'est connecté au système.',
        dateCreation: new Date('2025-07-31T08:30:00'),
        isRead: true,
        isArchived: false,
        priority: 'low',
        source: 'Système'
      },
      {
        id: '8',
        type: 'success',
        title: 'Validation terminée',
        message: '15 familles ont été validées par le superviseur ce matin.',
        dateCreation: new Date('2025-07-30T11:45:00'),
        isRead: true,
        isArchived: false,
        priority: 'medium',
        source: 'Système',
        actionUrl: '/familles?statut=Validé'
      }
    ];
  }
}
