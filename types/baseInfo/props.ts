import type { BaseInfoData } from './data';
import type { CountryCode } from '@/data/geo/countries';

export type { SearchSelectProps } from '@/components/ui/SearchSelect';

// ─── Main Components ──────────────────────────────────────────────────────────

export interface BaseInfoProps {
  data: BaseInfoData;
  onChange: (data: BaseInfoData) => void;
  onSave: () => void;
  saved: boolean;
  fieldErrors: Record<string, string>;
}

export interface AmenitiesProps {
  data: BaseInfoData;
  onChange: (data: BaseInfoData) => void;
  onSave: () => void;
  saved: boolean;
}

export interface CountrySelectProps {
  value: CountryCode;
  onChange: (code: CountryCode) => void;
  countryNames?: Record<string, string>;
  searchPlaceholder?: string;
  noResultsText?: string;
}
