// Author data for team section
import saihajPhoto from './saihaj.webp';

export interface Author {
  avatar?: { blurDataURL?: string; src: string } | string;
  github?: string;
  link: string;
  name: string;
}

export const authors: Record<string, Author> = {
  arda: {
    github: 'ardatan',
    link: 'https://twitter.com/ardatanrikulu',
    name: 'Arda Tanrikulu',
  },
  denis: {
    github: 'enisdenjo',
    link: 'https://github.com/enisdenjo',
    name: 'Denis Badurina',
  },
  dotan: {
    github: 'dotansimha',
    link: 'https://github.com/dotansimha',
    name: 'Dotan Simha',
  },
  gil: {
    github: 'gilgardosh',
    link: 'https://github.com/gilgardosh',
    name: 'Gil Gardosh',
  },
  jason: {
    github: 'jasonkuhrt',
    link: 'https://github.com/jasonkuhrt',
    name: 'Jason Kuhrt',
  },
  jdolle: {
    github: 'jdolle',
    link: 'https://github.com/jdolle',
    name: 'Jeff Dolle',
  },
  kamil: {
    github: 'kamilkisiela',
    link: 'https://x.com/kamilkisiela',
    name: 'Kamil Kisiela',
  },
  laurin: {
    github: 'n1ru4l',
    link: 'https://twitter.com/n1rual',
    name: 'Laurin Quast',
  },
  saihaj: {
    avatar: saihajPhoto,
    github: 'saihaj',
    link: 'https://github.com/saihaj',
    name: 'Saihajpreet Singh',
  },
  tuval: {
    github: 'TuvalSimha',
    link: 'https://github.com/tuvalsimha',
    name: 'Tuval Simha',
  },
  uri: {
    github: 'Urigo',
    link: 'https://github.com/Urigo',
    name: 'Uri Goldshtein',
  },
  valentin: {
    github: 'EmrysMyrddin',
    link: 'https://github.com/EmrysMyrddin',
    name: 'Valentin Cocaud',
  },
};
