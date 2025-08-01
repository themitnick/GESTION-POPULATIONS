export interface Adresse {
  rue: string;
  quartier: string;
  codePostal: string;
  ville: string;
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
}

export interface Membre {
  id: string;
  nom: string;
  prenoms: string;
  sexe: 'M' | 'F';
  dateNaissance: Date;
  lieuNaissance: string;
  nationalite: string;
  relationChef?: string; // Relation avec le chef de famille
  profession?: string;
  niveauEtude?: 'Aucun' | 'Primaire' | 'Secondaire' | 'Supérieur';
  situationMatrimoniale?: 'Célibataire' | 'Marié' | 'Divorcé' | 'Veuf';
  numeroIdentite?: string;
  telephone?: string;
  email?: string;
  estChefFamille: boolean;
  estActif: boolean;
  dateEnregistrement: Date;
  dateMiseAJour: Date;
  observations?: string;
}

export interface Famille {
  id: string;
  nomFamille: string;
  adresse: Adresse;
  chefFamille: Membre;
  membres: Membre[];
  nombreMembres: number;
  revenusEstimes?: number;
  typeLogement?: 'Propriétaire' | 'Locataire' | 'Hébergé';
  sourceEau?: 'Robinet' | 'Puits' | 'Forage' | 'Autre';
  sourceElectricite?: 'CIE' | 'Groupe électrogène' | 'Solaire' | 'Aucune';
  evacuationEaux?: 'Réseau public' | 'Fosse septique' | 'Nature' | 'Autre';
  numeroCompte?: string;
  dateCreation: Date; // Date de création
  dateEnregistrement: Date;
  dateMiseAJour: Date;
  statutValidation: 'Brouillon' | 'Validé' | 'Archivé';
  observations?: string;
}

export interface FamilleFormData {
  nomFamille: string;
  adresse: Adresse;
  chefFamille: Omit<Membre, 'id' | 'estChefFamille' | 'estActif' | 'dateEnregistrement' | 'dateMiseAJour'>;
  revenusEstimes?: number;
  typeLogement?: string;
  sourceEau?: string;
  sourceElectricite?: string;
  evacuationEaux?: string;
  observations?: string;
}

export interface MembreFormData {
  nom: string;
  prenoms: string;
  sexe: 'M' | 'F';
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  profession?: string;
  niveauEtude?: string;
  situationMatrimoniale?: string;
  numeroIdentite?: string;
  telephone?: string;
  email?: string;
  observations?: string;
}
