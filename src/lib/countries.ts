export function getSortedCountries() {
  const prioritySet = new Set(priorityCountryNames);
  const priority = countries.filter((c) => prioritySet.has(c.name));
  const others = countries.filter((c) => !prioritySet.has(c.name));
  return [...priority, ...others];
}

export const priorityCountryNames = [
  "Kuwait",
  "Saudi Arabia",
  "Bahrain",
  "Qatar",
  "United Arab Emirates",
];
  
export const countries = [
  // 🌍 Gulf / Middle East Priority
  { name: 'Kuwait', code: 'KW', phoneCode: '+965', flag: '🇰🇼' },
  { name: 'Saudi Arabia', code: 'SA', phoneCode: '+966', flag: '🇸🇦' },
  { name: 'Bahrain', code: 'BH', phoneCode: '+973', flag: '🇧🇭' },
  { name: 'Qatar', code: 'QA', phoneCode: '+974', flag: '🇶🇦' },
  { name: 'United Arab Emirates', code: 'AE', phoneCode: '+971', flag: '🇦🇪' },
  { name: 'Oman', code: 'OM', phoneCode: '+968', flag: '🇴🇲' },

  // 🇸🇦 South Asia
  { name: 'India', code: 'IN', phoneCode: '+91', flag: '🇮🇳' },
  { name: 'Bangladesh', code: 'BD', phoneCode: '+880', flag: '🇧🇩' },
  { name: 'Pakistan', code: 'PK', phoneCode: '+92', flag: '🇵🇰' },
  { name: 'Sri Lanka', code: 'LK', phoneCode: '+94', flag: '🇱🇰' },
  { name: 'Nepal', code: 'NP', phoneCode: '+977', flag: '🇳🇵' },
  { name: 'Bhutan', code: 'BT', phoneCode: '+975', flag: '🇧🇹' },
  { name: 'Maldives', code: 'MV', phoneCode: '+960', flag: '🇲🇻' },

  // 🇪🇺 Major European Countries
  { name: 'United Kingdom', code: 'GB', phoneCode: '+44', flag: '🇬🇧' },
  { name: 'Germany', code: 'DE', phoneCode: '+49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', phoneCode: '+33', flag: '🇫🇷' },
  { name: 'Italy', code: 'IT', phoneCode: '+39', flag: '🇮🇹' },
  { name: 'Spain', code: 'ES', phoneCode: '+34', flag: '🇪🇸' },
  { name: 'Netherlands', code: 'NL', phoneCode: '+31', flag: '🇳🇱' },
  { name: 'Sweden', code: 'SE', phoneCode: '+46', flag: '🇸🇪' },
  { name: 'Norway', code: 'NO', phoneCode: '+47', flag: '🇳🇴' },
  { name: 'Switzerland', code: 'CH', phoneCode: '+41', flag: '🇨🇭' },
  { name: 'Denmark', code: 'DK', phoneCode: '+45', flag: '🇩🇰' },
  { name: 'Finland', code: 'FI', phoneCode: '+358', flag: '🇫🇮' },
  { name: 'Ireland', code: 'IE', phoneCode: '+353', flag: '🇮🇪' },
  { name: 'Portugal', code: 'PT', phoneCode: '+351', flag: '🇵🇹' },
  { name: 'Poland', code: 'PL', phoneCode: '+48', flag: '🇵🇱' },
  { name: 'Greece', code: 'GR', phoneCode: '+30', flag: '🇬🇷' },
  { name: 'Austria', code: 'AT', phoneCode: '+43', flag: '🇦🇹' },
  { name: 'Belgium', code: 'BE', phoneCode: '+32', flag: '🇧🇪' },
  { name: 'Czech Republic', code: 'CZ', phoneCode: '+420', flag: '🇨🇿' },
  { name: 'Hungary', code: 'HU', phoneCode: '+36', flag: '🇭🇺' },

  // 🌏 Other major countries (for completeness)
  { name: 'Turkey', code: 'TR', phoneCode: '+90', flag: '🇹🇷' },
  { name: 'Egypt', code: 'EG', phoneCode: '+20', flag: '🇪🇬' },
  { name: 'Singapore', code: 'SG', phoneCode: '+65', flag: '🇸🇬' },
  { name: 'Malaysia', code: 'MY', phoneCode: '+60', flag: '🇲🇾' },
  { name: 'Indonesia', code: 'ID', phoneCode: '+62', flag: '🇮🇩' },
  { name: 'Philippines', code: 'PH', phoneCode: '+63', flag: '🇵🇭' },
];