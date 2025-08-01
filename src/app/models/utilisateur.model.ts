export interface Utilisateur {
  id: string;
  nom: string;
  prenoms: string;
  email: string;
  telephone?: string;
  role: 'Admin' | 'Superviseur' | 'Agent';
  statut: 'Actif' | 'Inactif';
  dateCreation: Date;
  derniereConnexion?: Date;
  avatar?: string;
  preferences: {
    langue: 'fr' | 'en';
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}
