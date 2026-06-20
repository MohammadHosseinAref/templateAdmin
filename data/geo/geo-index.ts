import type { CountryCode } from './countries';
import franceRegions from './france-regions.json';
import franceCities from './france-cities.json';

type CityEntry = { name: string; region: string };

export const GEO_REGIONS: Partial<Record<CountryCode, string[]>> = {
  FR: franceRegions as string[],
};

export const GEO_CITIES: Partial<Record<CountryCode, CityEntry[]>> = {
  FR: franceCities as CityEntry[],
};
