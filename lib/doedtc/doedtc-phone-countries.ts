export type DoeDtcPhoneCountry = {
  iso: string;
  name: string;
  dialCode: string;
  placeholder: string;
};

function flagEmoji(iso: string): string {
  return iso
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function doeDtcPhoneCountryFlag(iso: string): string {
  return flagEmoji(iso);
}

export const DOEDTC_PHONE_COUNTRIES: DoeDtcPhoneCountry[] = [
  { iso: "US", name: "United States", dialCode: "+1", placeholder: "(555) 555-0100" },
  { iso: "CA", name: "Canada", dialCode: "+1", placeholder: "(555) 555-0100" },
  { iso: "GB", name: "United Kingdom", dialCode: "+44", placeholder: "7400 123456" },
  { iso: "AU", name: "Australia", dialCode: "+61", placeholder: "412 345 678" },
  { iso: "IN", name: "India", dialCode: "+91", placeholder: "98765 43210" },
  { iso: "MX", name: "Mexico", dialCode: "+52", placeholder: "55 1234 5678" },
  { iso: "DE", name: "Germany", dialCode: "+49", placeholder: "1512 3456789" },
  { iso: "FR", name: "France", dialCode: "+33", placeholder: "6 12 34 56 78" },
  { iso: "BR", name: "Brazil", dialCode: "+55", placeholder: "11 91234-5678" },
  { iso: "JP", name: "Japan", dialCode: "+81", placeholder: "90-1234-5678" },
  { iso: "KR", name: "South Korea", dialCode: "+82", placeholder: "10-1234-5678" },
  { iso: "SG", name: "Singapore", dialCode: "+65", placeholder: "8123 4567" },
  { iso: "NZ", name: "New Zealand", dialCode: "+64", placeholder: "21 123 4567" },
  { iso: "IE", name: "Ireland", dialCode: "+353", placeholder: "85 012 3456" },
  { iso: "IL", name: "Israel", dialCode: "+972", placeholder: "50-123-4567" },
  { iso: "PH", name: "Philippines", dialCode: "+63", placeholder: "917 123 4567" },
];

export const DOEDTC_DEFAULT_PHONE_COUNTRY = DOEDTC_PHONE_COUNTRIES[0];

export function doeDtcComposePhoneNumber(country: DoeDtcPhoneCountry, nationalValue: string): string {
  const digits = nationalValue.replace(/\D/g, "");
  if (!digits) return "";
  return `${country.dialCode}${digits}`;
}

export function doeDtcFindPhoneCountry(iso: string): DoeDtcPhoneCountry {
  return DOEDTC_PHONE_COUNTRIES.find((country) => country.iso === iso) ?? DOEDTC_DEFAULT_PHONE_COUNTRY;
}
