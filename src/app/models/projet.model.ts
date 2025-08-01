export interface Projet {
  id: string;
  nom: string;
  description: string;
  quartier: string;
  type: 'Infrastructure' | 'Social' | 'Economique' | 'Environnemental' | 'Education' | 'Santé';
  statut: 'planifie' | 'en_cours' | 'termine' | 'suspendu' | 'annule';
  budget: number;
  budgetDepense: number;
  dateDebut: Date;
  dateFin?: Date;
  dateFinPrevue: Date;
  responsable: string;
  beneficiaires: {
    familles: number;
    individus: number;
    details?: string;
  };
  partenaires?: string[];
  objectifs: string[];
  indicateurs?: {
    nom: string;
    valeurCible: number;
    valeurActuelle: number;
    unite: string;
  }[];
  avancement: number; // Pourcentage de 0 à 100
  priorite: 'Basse' | 'Moyenne' | 'Haute' | 'Urgente';
  sourceFinancement: string[];
  documentsJoints?: {
    nom: string;
    url: string;
    type: string;
  }[];
  commentaires?: {
    id: string;
    auteur: string;
    date: Date;
    contenu: string;
  }[];
  dateCreation: Date;
  dateMiseAJour: Date;
  creeParUtilisateur: string;
  modifieParUtilisateur?: string;
  observations?: string;
}

export interface ProjetFormData {
  nom: string;
  description: string;
  quartier: string;
  type: string;
  budget: number;
  dateDebut: string;
  dateFinPrevue: string;
  responsable: string;
  beneficiairesFamilles: number;
  beneficiairesIndividus: number;
  beneficiairesDetails?: string;
  partenaires?: string;
  objectifs: string;
  priorite: string;
  sourceFinancement: string;
  observations?: string;
}

export interface IndicateurProjet {
  id: string;
  projetId: string;
  nom: string;
  description?: string;
  valeurCible: number;
  valeurActuelle: number;
  unite: string;
  dateEvaluation: Date;
  commentaire?: string;
}

export interface RapportProjet {
  id: string;
  projetId: string;
  periode: {
    debut: Date;
    fin: Date;
  };
  avancement: number;
  activitesRealisees: string[];
  difficultesRencontrees?: string[];
  recommandations?: string[];
  prochainEtapes?: string[];
  budgetUtilise: number;
  indicateursAtteints?: {
    indicateurId: string;
    valeur: number;
    commentaire?: string;
  }[];
  dateCreation: Date;
  creeParUtilisateur: string;
}
