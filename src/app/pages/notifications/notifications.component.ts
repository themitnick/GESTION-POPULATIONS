import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mx-auto p-6 max-w-4xl">
      <div class="mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
            <p class="text-gray-600">Centre de notifications et alertes</p>
          </div>
          <div class="flex space-x-3">
            <button
              (click)="markAllAsRead()"
              [disabled]="unreadCount === 0"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Tout marquer comme lu
            </button>
            <button
              (click)="refreshNotifications()"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Filtrer par type:</span>
            <select 
              [(ngModel)]="selectedType" 
              (ngModelChange)="applyFilters()"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Tous</option>
              <option value="info">Information</option>
              <option value="success">Succès</option>
              <option value="warning">Avertissement</option>
              <option value="error">Erreur</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Priorité:</span>
            <select 
              [(ngModel)]="selectedPriority" 
              (ngModelChange)="applyFilters()"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Toutes</option>
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Statut:</span>
            <select 
              [(ngModel)]="selectedStatus" 
              (ngModelChange)="applyFilters()"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Toutes</option>
              <option value="unread">Non lues</option>
              <option value="read">Lues</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM11 17H7l5 5v-5z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Total</p>
              <p class="text-lg font-semibold text-gray-900">{{ totalNotifications }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Non lues</p>
              <p class="text-lg font-semibold text-gray-900">{{ unreadCount }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.464 0L4.349 15.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Priorité élevée</p>
              <p class="text-lg font-semibold text-gray-900">{{ highPriorityCount }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Aujourd'hui</p>
              <p class="text-lg font-semibold text-gray-900">{{ todayCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des notifications -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Notifications ({{ filteredNotifications.length }})
          </h3>
        </div>

        @if (loading) {
          <div class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Chargement...</p>
          </div>
        } @else if (filteredNotifications.length === 0) {
          <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM11 17H7l5 5v-5z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune notification</h3>
            <p class="mt-1 text-sm text-gray-500">Aucune notification ne correspond aux critères sélectionnés.</p>
          </div>
        } @else {
          <div class="divide-y divide-gray-200">
            @for (notification of filteredNotifications; track notification.id) {
              <div [class]="getNotificationClass(notification)" (click)="markAsRead(notification)">
                <div class="flex items-start space-x-3">
                  <!-- Icône -->
                  <div [class]="getIconClass(notification.type)" class="flex-shrink-0 p-2 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      @switch (notification.type) {
                        @case ('info') {
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        }
                        @case ('success') {
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        }
                        @case ('warning') {
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.464 0L4.349 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                        }
                        @case ('error') {
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        }
                      }
                    </svg>
                  </div>

                  <!-- Contenu -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <h4 class="text-sm font-medium text-gray-900">{{ notification.title }}</h4>
                      <div class="flex items-center space-x-2">
                        <span [class]="getPriorityClass(notification.priority)">
                          {{ getPriorityLabel(notification.priority) }}
                        </span>
                        @if (!notification.isRead) {
                          <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
                        }
                      </div>
                    </div>
                    <p class="mt-1 text-sm text-gray-600">{{ notification.message }}</p>
                    <div class="mt-2 flex items-center justify-between">
                      <div class="flex items-center text-xs text-gray-500 space-x-4">
                        <span>{{ notification.dateCreation | date:'dd/MM/yyyy à HH:mm' }}</span>
                        <span>{{ notification.source }}</span>
                      </div>
                      @if (notification.actionUrl) {
                        <a 
                          [routerLink]="notification.actionUrl"
                          class="text-orange-600 hover:text-orange-900 text-xs font-medium">
                          Voir détails →
                        </a>
                      }
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-2">
                    @if (!notification.isRead) {
                      <button
                        (click)="markAsRead(notification); $event.stopPropagation()"
                        class="text-blue-600 hover:text-blue-900 text-xs">
                        Marquer comme lu
                      </button>
                    }
                    <button
                      (click)="archiveNotification(notification.id); $event.stopPropagation()"
                      class="text-gray-600 hover:text-gray-900 text-xs">
                      Archiver
                    </button>
                    <button
                      (click)="deleteNotification(notification.id); $event.stopPropagation()"
                      class="text-red-600 hover:text-red-900 text-xs">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  loading = false;
  
  selectedType = '';
  selectedPriority = '';
  selectedStatus = '';

  totalNotifications = 0;
  unreadCount = 0;
  highPriorityCount = 0;
  todayCount = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;
    this.notificationService.getAllNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications.filter(n => !n.isArchived);
        this.updateStatistics();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des notifications:', error);
        this.loading = false;
      }
    });
  }

  updateStatistics() {
    this.totalNotifications = this.notifications.length;
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    this.highPriorityCount = this.notifications.filter(n => n.priority === 'high').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.todayCount = this.notifications.filter(n => {
      const notificationDate = new Date(n.dateCreation);
      notificationDate.setHours(0, 0, 0, 0);
      return notificationDate.getTime() === today.getTime();
    }).length;
  }

  applyFilters() {
    this.filteredNotifications = this.notifications.filter(notification => {
      const typeMatch = !this.selectedType || notification.type === this.selectedType;
      const priorityMatch = !this.selectedPriority || notification.priority === this.selectedPriority;
      const statusMatch = !this.selectedStatus || 
        (this.selectedStatus === 'read' && notification.isRead) ||
        (this.selectedStatus === 'unread' && !notification.isRead);
      
      return typeMatch && priorityMatch && statusMatch;
    });
  }

  markAsRead(notification: Notification) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.isRead = true;
        this.updateStatistics();
      });
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.updateStatistics();
    });
  }

  archiveNotification(notificationId: string) {
    this.notificationService.archiveNotification(notificationId).subscribe(() => {
      this.notifications = this.notifications.filter(n => n.id !== notificationId);
      this.updateStatistics();
      this.applyFilters();
    });
  }

  deleteNotification(notificationId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      this.notificationService.deleteNotification(notificationId).subscribe(() => {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.updateStatistics();
        this.applyFilters();
      });
    }
  }

  refreshNotifications() {
    this.loadNotifications();
  }

  getNotificationClass(notification: Notification): string {
    const baseClass = 'p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150';
    const unreadClass = notification.isRead ? '' : 'bg-blue-50 border-l-4 border-orange-500';
    return `${baseClass} ${unreadClass}`;
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-600';
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getPriorityClass(priority: string): string {
    const baseClass = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    switch (priority) {
      case 'high':
        return `${baseClass} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClass} bg-green-100 text-green-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high':
        return 'Élevée';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Faible';
      default:
        return 'Normal';
    }
  }
}
