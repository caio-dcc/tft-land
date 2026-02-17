import { PlatformDataDTO, SummonerDTO, AccountDTO } from '@/types/tft';
import { MOCK_ACCOUNT, MOCK_PLATFORM_DATA, MOCK_SUMMONER } from './mockData';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const BASE_URL_BR1 = 'https://br1.api.riotgames.com';
const BASE_URL_AMERICAS = 'https://americas.api.riotgames.com';

// Flag to force mock mode (useful for dev if key is missing/invalid)
const USE_MOCK = process.env.NODE_ENV === 'development'; 

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

  // Fallback imediato se não tiver key
  if (!RIOT_API_KEY) {
    console.warn('RIOT_API_KEY missing. Returning MOCK data.');
    return getMockDataForEndpoint<T>(endpoint);
  }

  const baseUrl = region === 'americas' ? BASE_URL_AMERICAS : BASE_URL_BR1;
  const url = `${baseUrl}${endpoint}`;

  console.log(`[RiotAPI] Fetching: ${url}`);
  console.log(`[RiotAPI] Key: ${RIOT_API_KEY ? RIOT_API_KEY.substring(0, 5) + '...' : 'MISSING'}`);

  try {
    const response = await fetch(url, {
        headers: {
        'X-Riot-Token': RIOT_API_KEY || '',
        },
        next: { revalidate: 60 }
    });

    if (!response.ok) {
        // Se der erro de auth (401/403), fazemos fallback para mock em desenvolvimento
        if ((response.status === 401 || response.status === 403) && USE_MOCK) {
            console.warn(`Riot API returned ${response.status}. Falling back to MOCK data.`);
            return getMockDataForEndpoint<T>(endpoint);
        }

        if (response.status === 404) {
            console.warn(`Resource not found: ${endpoint}`);
        }
        throw new RiotApiError(response.status, `Riot API request failed: ${response.statusText} (${response.status})`);
    }

    return response.json();

  } catch (error) {
     if (USE_MOCK && error instanceof RiotApiError && (error.status === 403 || error.status === 401)) {
         return getMockDataForEndpoint<T>(endpoint);
     }
     throw error;
  }
}

function getMockDataForEndpoint<T>(endpoint: string): T {
    console.log(`[MOCK] Returning mock data for: ${endpoint}`);
    if (endpoint.includes('/tft/status/v1/platform-data')) {
        return MOCK_PLATFORM_DATA as unknown as T;
    }
    if (endpoint.includes('/riot/account/v1/accounts/by-riot-id')) {
        // Customize mock based on URL if needed
        const parts = endpoint.split('/');
        const name = parts[parts.length - 2];
        const tag = parts[parts.length - 1];
        return { ...MOCK_ACCOUNT, gameName: name || 'Mock', tagLine: tag || 'BR1' } as unknown as T;
    }
    if (endpoint.includes('/tft/summoner/v1/summoners/by-puuid')) {
        return MOCK_SUMMONER as unknown as T;
    }
    throw new Error(`No mock data available for endpoint: ${endpoint}`);
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
