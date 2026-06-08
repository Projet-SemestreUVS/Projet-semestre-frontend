// src/services/statsService.ts
import api from './api';

export interface StatisticsResponse {
  total_users: number;
  total_prestataires: number;
  total_demandeurs: number;
  total_services: number;
  total_reservations: number;
  total_revenus: number;
  reservations_par_mois: Array<{
    mois: string;
    total: number;
  }>;
  revenus_par_mois: Array<{
    mois: string;
    total: number;
  }>;
}

export const getStatistics = async (): Promise<StatisticsResponse> => {
  try {
    const response = await api.get('/admin/statistiques');
    console.log("Réponse API stats:", response.data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    // Si la structure est différente, adapter
    if (response.data.total_users !== undefined) {
      return response.data;
    }
    
    // Données par défaut en cas d'erreur
    return getDefaultStats();
    
  } catch (error) {
    console.error("Erreur getStatistics:", error);
    // Retourner des données par défaut pour le développement
    return getDefaultStats();
  }
};

// Données par défaut pour le développement
const getDefaultStats = (): StatisticsResponse => {
  return {
    total_users: 1250,
    total_prestataires: 450,
    total_demandeurs: 800,
    total_services: 320,
    total_reservations: 1250,
    total_revenus: 12500000,
    reservations_par_mois: [
      { mois: "Jan", total: 45 },
      { mois: "Fév", total: 52 },
      { mois: "Mar", total: 48 },
      { mois: "Avr", total: 61 },
      { mois: "Mai", total: 55 },
      { mois: "Juin", total: 67 }
    ],
    revenus_par_mois: [
      { mois: "Jan", total: 450000 },
      { mois: "Fév", total: 520000 },
      { mois: "Mar", total: 480000 },
      { mois: "Avr", total: 610000 },
      { mois: "Mai", total: 550000 },
      { mois: "Juin", total: 670000 }
    ]
  };
};