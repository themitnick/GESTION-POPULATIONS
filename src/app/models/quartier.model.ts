export interface Quartier {
  id: string;
  nom: string;
  code?: string;
  description?: string;
  superficie: number;
  population: number;
  nombreFamilles: number;
  nombreMenages?: number;
  chef: {
    nom: string;
    prenoms: string;
    telephone: string;
    email?: string;
  };
  coordonnees: {
    latitude: number;
    longitude: number;
  };
  limites?: Array<{
    latitude: number;
    longitude: number;
  }>;
  infrastructures?: {
    ecoles: number;
    centres_sante: number;
    marches: number;
    lieux_culte: number;
    terrains_sport: number;
  };
  services?: {
    eau_courante: number;
    electricite: number;
    assainissement: number;
    internet: number;
    transport_public: number;
  };
  projets: Projet[];
  dateCreation?: Date;
  dateModification?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Projet {
  id: string;
  quartierId: string;
  nom: string;
  description: string;
  type: 'infrastructure' | 'social' | 'economique' | 'environnement' | 'securite';
  statut: 'planifie' | 'en-cours' | 'termine' | 'suspendu' | 'annule';
  budget: number;
  budgetDepense: number;
  dateDebut: Date;
  dateFin?: Date;
  dateFinPrevue: Date;
  responsable: string;
  beneficiaires: number;
  description_detaillee?: string;
  objectifs: string[];
  indicateurs: IndicateurProjet[];
  images?: string[];
  documents?: string[];
  dateCreation: Date;
  dateModification: Date;
}

export interface IndicateurProjet {
  id: string;
  nom: string;
  description: string;
  unite: string;
  valeurCible: number;
  valeurActuelle: number;
  pourcentageRealisation: number;
  dateEvaluation: Date;
}
