export const COUNTRIES = {
  FR: { flag: '🇫🇷', phoneCode: '+33' },
  // ES: { flag: '🇪🇸', phoneCode: '+34' },
  // DE: { flag: '🇩🇪', phoneCode: '+49' },
  // IT: { flag: '🇮🇹', phoneCode: '+39' },
} as const;

export type CountryCode = keyof typeof COUNTRIES;
