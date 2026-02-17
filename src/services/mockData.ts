import { AccountDTO, PlatformDataDTO, SummonerDTO } from '@/types/tft';

export const MOCK_PLATFORM_DATA: PlatformDataDTO = {
  id: 'BR1',
  name: 'Brazil',
  locales: ['pt_BR'],
  maintenances: [],
  incidents: [],
};

export const MOCK_ACCOUNT: AccountDTO = {
  puuid: 'mock-puuid-12345',
  gameName: 'MockUser',
  tagLine: 'BR1',
};

export const MOCK_SUMMONER: SummonerDTO = {
  id: 'mock-summoner-id',
  accountId: 'mock-account-id',
  puuid: 'mock-puuid-12345',
  name: 'MockUser',
  profileIconId: 6666, // Example icon
  revisionDate: 1700000000000,
  summonerLevel: 99,
};
