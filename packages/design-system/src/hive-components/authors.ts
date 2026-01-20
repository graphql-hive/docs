// Author data for team section
export interface Author {
  name: string;
  avatar?: string | { src: string; blurDataURL?: string };
  link?: string;
  github?: string;
}

export const authors: Record<string, Author> = {
  denis: { name: 'Denis Badurina', github: 'enisdenjo' },
  dotan: { name: 'Dotan Simha', github: 'dotansimha' },
  gil: { name: 'Gil Kaufman', github: 'gilgardosh' },
  kamil: { name: 'Kamil Kisiela', github: 'kamilkisiela' },
  laurin: { name: 'Laurin Quast', github: 'n1ru4l' },
  saihaj: { name: 'Saihajpreet Singh', github: 'saihaj' },
  tuval: { name: 'Tuval Simha', github: 'TuvalSimha' },
  uri: { name: 'Uri Goldshtein', github: 'urigo' },
  valentin: { name: 'Valentin Cocaud', github: 'EmrysMyrddin' },
  jason: { name: 'Jason Kuhrt', github: 'jasonkuhrt' },
  arda: { name: 'Arda Tanrikulu', github: 'ardatan' },
  jdolle: { name: 'Jesse Dolle', github: 'jdolle' },
};
