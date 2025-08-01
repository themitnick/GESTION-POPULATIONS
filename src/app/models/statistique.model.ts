export interface Statistique {
  id: string;
  type: 'population' | 'projet' | 'economique' | 'social';
  titre: string;
  valeur: number;
  unite: string;
  evolution: {
    pourcentage: number;
    periode: string;
    tendance: 'hausse' | 'baisse' | 'stable';
  };
  dateCalcul: Date;
  details?: any;
}

export interface TableauBord {
  populationTotale: number;
  nombreFamilles: number;
  nombreQuartiers: number;
  projetsEnCours: number;
  projetsTermines: number;
  budgetTotal: number;
  budgetDepense: number;
  repartitionGenre: {
    hommes: number;
    femmes: number;
  };
  repartitionAge: {
    enfants: number; // 0-17
    adultes: number; // 18-59
    seniors: number; // 60+
  };
  niveauEducation: {
    aucun: number;
    primaire: number;
    secondaire: number;
    superieur: number;
  };
  activiteEconomique: {
    actifs: number;
    chomeurs: number;
    etudiants: number;
    retraites: number;
  };
  statistiquesQuartier: Array<{
    quartier: string;
    population: number;
    familles: number;
    projets: number;
  }>;
  evolutionPopulation: Array<{
    mois: string;
    population: number;
  }>;
  dateCalcul: Date;
}

export interface Etiquette {
  id: string;
  type: 'noel' | 'fete-meres';
  nomComplet: string;
  adresse: string;
  quartier: string;
  age: number;
  sexe: 'M' | 'F';
  imprime: boolean;
  dateGeneration: Date;
  dateImpression?: Date;
}

export interface StatistiquesGenerales {
  totalFamilles: number;
  totalMembres: number;
  totalQuartiers: number;
  totalProjets: number;
  repartitionParSexe: {
    hommes: number;
    femmes: number;
  };
  repartitionParAge: {
    enfants: number;
    adultes: number;
  };
  famillesParQuartier: { [quartier: string]: number };
  evolutionMensuelle: { mois: string; nouvelles: number }[];
}

export interface StatistiquesQuartier {
  quartier: string;
  nombreFamilles: number;
  nombreMembres: number;
  nombreProjets: number;
  population: {
    total: number;
    hommes: number;
    femmes: number;
    enfants: number;
    adultes: number;
  };
  infrastructures: { [key: string]: boolean };
  services: { [key: string]: boolean };
  projetsActifs: number;
  budgetTotal: number;
  derniereMiseAJour: Date;
}

export interface StatistiquesPopulation {
  totalPopulation: number;
  repartitionParAge: { [tranche: string]: number };
  repartitionParSexe: {
    hommes: number;
    femmes: number;
  };
  repartitionParQuartier: { [quartier: string]: number };
  densitePopulation: number;
  croissanceDemographique: number;
}

export interface ExportResult {
  success: boolean;
  fileName: string;
  url: string;
  message: string;
}
