// Custom hook for internationalization
import { useRouter } from 'next/router';

// Define the structure of our translations
interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

// Type for our dictionary
type Dictionary = any;

// Import dictionaries
import enCommon from '@/public/locales/en/common.json';
import urCommon from '@/public/locales/ur/common.json';

// Get the dictionary based on locale
const getDictionary = (locale: string): Dictionary => {
  switch (locale) {
    case 'ur':
      return urCommon;
    default:
      return enCommon;
  }
};

// Flatten the nested object structure to allow dot notation access
const flattenObject = (obj: any, prefix: string = ''): { [key: string]: string } => {
  const flattened: { [key: string]: string } = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
};

export const useTranslations = () => {
  const { locale } = useRouter();
  const effectiveLocale = locale || 'en'; // Default to 'en' if locale is undefined
  const dictionary = getDictionary(effectiveLocale);
  const flatDict = flattenObject(dictionary);

  const t = (key: string, fallback?: string): string => {
    return flatDict[key] || fallback || key;
  };

  return { t };
};