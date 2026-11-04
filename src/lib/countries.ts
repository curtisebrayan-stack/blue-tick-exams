export type CountryExam = {
  name: string;
  detail?: string;
  preparationPath?: string;
};

export type ExamDestination = {
  slug: string;
  name: string;
  flag: string;
  summary: string;
  exams: CountryExam[];
};

export const EXAM_DESTINATIONS: ExamDestination[] = [
  {
    slug: "canada",
    name: "Canada",
    flag: "🇨🇦",
    summary: "Français et anglais",
    exams: [
      { name: "TCF Canada", preparationPath: "/tcf-canada" },
      { name: "TEF Canada" },
      { name: "IELTS General Training" },
      { name: "CELPIP-General" },
      { name: "PTE Core" },
    ],
  },
  {
    slug: "australie",
    name: "Australie",
    flag: "🇦🇺",
    summary: "Études, travail et immigration",
    exams: [
      { name: "IELTS", detail: "General Training ou Academic selon le visa" },
      { name: "PTE Academic" },
      { name: "TOEFL iBT" },
      { name: "Cambridge English" },
    ],
  },
  {
    slug: "royaume-uni",
    name: "Royaume-Uni",
    flag: "🇬🇧",
    summary: "Anglais et démarches UKVI",
    exams: [
      { name: "IELTS for UKVI" },
      { name: "PTE Academic UKVI" },
      { name: "SELT", detail: "Tests d’anglais agréés par UKVI" },
    ],
  },
  {
    slug: "etats-unis",
    name: "États-Unis",
    flag: "🇺🇸",
    summary: "Études et admissions",
    exams: [
      { name: "TOEFL iBT" },
      { name: "IELTS Academic" },
      { name: "PTE Academic" },
    ],
  },
  {
    slug: "france-europe",
    name: "France & Europe",
    flag: "🇫🇷",
    summary: "Français et études",
    exams: [
      { name: "DELF" },
      { name: "TCF" },
    ],
  },
  {
    slug: "allemagne",
    name: "Allemagne",
    flag: "🇩🇪",
    summary: "Allemand et études",
    exams: [
      { name: "Goethe-Zertifikat" },
      { name: "TestDaF" },
      { name: "telc Deutsch" },
    ],
  },
];
