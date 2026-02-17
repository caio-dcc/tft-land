import { PlatformDataDTO, SummonerDTO, AccountDTO } from '@/types/tft';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const BASE_URL_BR1 = 'https://br1.api.riotgames.com';
const BASE_URL_AMERICAS = 'https://americas.api.riotgames.com';

/**
 * Erro customizado para falhas na API da Riot.
 */
class RiotApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'RiotApiError';
  }
}

/**
 * Função utilitária para fazer requisições à API da Riot.
 * 
 * @param endpoint O caminho do endpoint
 * @param region A região base para a URL (br1 ou americas)
 */
async function fetchRiotApi<T>(endpoint: string, region: 'br1' | 'americas' = 'br1'): Promise<T> {
  if (typeof window !== 'undefined') {
    throw new Error('Riot API requests must be made from the server side only.');
  }

  if (!RIOT_API_KEY) {
    throw new Error('RIOT_API_KEY is not defined in environment variables.');
  }

  const baseUrl = region === 'americas' ? BASE_URL_AMERICAS : BASE_URL_BR1;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'X-Riot-Token': RIOT_API_KEY,
    },
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    if (response.status === 404) {
      console.warn(`Resource not found: ${endpoint}`);
    }
    throw new RiotApiError(response.status, `Riot API request failed: ${response.statusText} (${response.status})`);
  }

  return response.json();
}

/**
 * Obtém o status dos serviços do TFT.
 */
export async function getTftStatus(): Promise<PlatformDataDTO> {
  return fetchRiotApi<PlatformDataDTO>('/tft/status/v1/platform-data', 'br1');
}

/**
 * Obtém uma conta Riot pelo Riot ID (GameName#TagLine).
 * Endpoint: /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
 * Note: Account V1 usa região 'AMERICAS' para contas BR/NA/LATAM.
 */
export async function getAccountByRiotId(gameName: string, tagLine: string): Promise<AccountDTO> {
  return fetchRiotApi<AccountDTO>(`/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, 'americas');
}

/**
 * Obtém dados de um invocador pelo PUUID.
 * Endpoint: /tft/summoner/v1/summoners/by-puuid/{puuid}
 */
export async function getSummonerByPuuid(puuid: string): Promise<SummonerDTO> {
   return fetchRiotApi<SummonerDTO>(`/tft/summoner/v1/summoners/by-puuid/${puuid}`, 'br1');
}
