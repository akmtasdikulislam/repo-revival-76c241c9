// Sponsor list — logos served via logo.dev
// Using the public demo token from logo.dev docs.
const LOGO_TOKEN = "pk_X-1ZO13GSgeOoUrIuJ6GMQ";

export function sponsorLogo(domain: string, size = 200) {
  return `https://img.logo.dev/${domain}?token=${LOGO_TOKEN}&size=${size}&format=png`;
}

export interface Sponsor {
  name: string;
  domain: string;
  tier?: string;
  tagline?: string;
}

export const SPONSORS: Sponsor[] = [
  {
    name: "Walton",
    domain: "waltonbd.com",
    tier: "Title Sponsor",
    tagline: "Presenting Partner · Electronics & Hardware",
  },
  { name: "Airtel", domain: "bd.airtel.com", tier: "Co-Sponsor", tagline: "Connectivity Partner" },
  { name: "Banglalink", domain: "banglalink.net", tier: "Co-Sponsor", tagline: "Digital Partner" },
  { name: "Teletalk", domain: "teletalk.com.bd", tier: "Co-Sponsor", tagline: "Network Partner" },
  { name: "Skitto", domain: "skitto.com", tier: "Community Partner", tagline: "Student Partner" },
  { name: "Grameenphone", domain: "grameenphone.com", tier: "Co-Sponsor", tagline: "Telecom Partner" },
  { name: "bKash", domain: "bkash.com", tier: "Payment Partner", tagline: "Fintech Partner" },
  { name: "Nagad", domain: "nagad.com.bd", tier: "Payment Partner", tagline: "Fintech Partner" },
  { name: "DBBL", domain: "dutchbanglabank.com", tier: "Banking Partner", tagline: "Banking Partner" },
  { name: "Trust Bank PLC", domain: "tblbd.com", tier: "Banking Partner", tagline: "Banking Partner" },
  { name: "UCB Bank PLC", domain: "ucb.com.bd", tier: "Banking Partner", tagline: "Banking Partner" },
  { name: "Jamuna Bank PLC", domain: "jamunabankbd.com", tier: "Banking Partner", tagline: "Banking Partner" },
  { name: "Singer", domain: "singerbd.com", tier: "Hardware Partner", tagline: "Appliances Partner" },
  { name: "HP", domain: "hp.com", tier: "Compute Partner", tagline: "Workstation Partner" },
  { name: "GigaByte", domain: "gigabyte.com", tier: "Compute Partner", tagline: "Hardware Partner" },
  { name: "Samsung", domain: "samsung.com", tier: "Device Partner", tagline: "Mobile Partner" },
  { name: "Xiaomi", domain: "mi.com", tier: "Device Partner", tagline: "Mobile Partner" },
  { name: "Honor", domain: "hihonor.com", tier: "Device Partner", tagline: "Mobile Partner" },
  { name: "Oppo", domain: "oppo.com", tier: "Device Partner", tagline: "Mobile Partner" },
  { name: "Vivo", domain: "vivo.com", tier: "Device Partner", tagline: "Mobile Partner" },
  { name: "LG", domain: "lg.com", tier: "Device Partner", tagline: "Display Partner" },
  { name: "HAVIT", domain: "havitsmart.com", tier: "Gear Partner", tagline: "Peripherals Partner" },
  { name: "DELL", domain: "dell.com", tier: "Compute Partner", tagline: "Workstation Partner" },
  { name: "Prothom Alo", domain: "prothomalo.com", tier: "Media Partner", tagline: "News Partner" },
  { name: "Kaler Kontho", domain: "kalerkantho.com", tier: "Media Partner", tagline: "News Partner" },
  { name: "TP-Link", domain: "tp-link.com", tier: "Network Partner", tagline: "Networking Partner" },
  { name: "D-Link", domain: "dlink.com", tier: "Network Partner", tagline: "Networking Partner" },
];
