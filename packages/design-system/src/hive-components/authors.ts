// Author data for team section
export interface Author {
  avatar?: { blurDataURL?: string; src: string; } | string;
  github?: string;
  link?: string;
  name: string;
}

export const authors: Record<string, Author> = {
  arda: { github: 'ardatan', name: 'Arda Tanrikulu' },
  denis: { github: 'enisdenjo', name: 'Denis Badurina' },
  dotan: { github: 'dotansimha', name: 'Dotan Simha' },
  gil: { github: 'gilgardosh', name: 'Gil Kaufman' },
  jason: { github: 'jasonkuhrt', name: 'Jason Kuhrt' },
  jdolle: { github: 'jdolle', name: 'Jesse Dolle' },
  kamil: { github: 'kamilkisiela', name: 'Kamil Kisiela' },
  laurin: { github: 'n1ru4l', name: 'Laurin Quast' },
  saihaj: { github: 'saihaj', name: 'Saihajpreet Singh' },
  tuval: { github: 'TuvalSimha', name: 'Tuval Simha' },
  uri: { github: 'urigo', name: 'Uri Goldshtein' },
  valentin: { github: 'EmrysMyrddin', name: 'Valentin Cocaud' },
};
