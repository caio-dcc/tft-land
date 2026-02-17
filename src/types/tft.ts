/**
 * Representa os dados da plataforma (status do serviço).
 * Baseado na documentação oficial da Riot API (tft-status-v1).
 */
export interface PlatformDataDTO {
  id: string;
  name: string;
  locales: string[];
  maintenances: StatusDTO[];
  incidents: StatusDTO[];
}

/**
 * Representa o status de manutenção ou incidente.
 */
export interface StatusDTO {
  id: number;
  maintenance_status: string;
  incident_severity: string;
  titles: ContentDTO[];
  updates: UpdateDTO[];
  created_at: string;
  archive_at: string | null;
  updated_at: string | null;
  platforms: string[];
}

export interface ContentDTO {
  locale: string;
  content: string;
}

export interface UpdateDTO {
  id: number;
  author: string;
  publish: boolean;
  publish_locations: string[];
  translations: ContentDTO[];
  created_at: string;
  updated_at: string;
}

/**
 * Representa um Invocador (Summoner) no TFT.
 * Baseado no endpoint tft-summoner-v1.
 */
export interface SummonerDTO {
  id: string; // Encrypted summoner ID
  accountId: string; // Encrypted account ID
  puuid: string; // Encrypted PUUID
  name: string; // Summoner name
  profileIconId: number; // ID of the summoner icon associated with the summoner
  revisionDate: number; // Date summoner was last modified specified as epoch milliseconds
  summonerLevel: number; // Summoner level associated with the summoner
}

/**
 * Representa uma Conta Riot (Riot ID).
 * Baseado no endpoint account-v1.
 */
export interface AccountDTO {
  puuid: string;
  gameName: string;
  tagLine: string;
}
