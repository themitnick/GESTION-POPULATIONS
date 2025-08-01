export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  dateCreation: Date;
  isRead: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high';
  source: string; // Source de la notification (système, utilisateur, etc.)
  actionUrl?: string; // URL vers l'action associée
  metadata?: any; // Données supplémentaires
}
