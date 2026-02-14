// Author data for team section
import { type } from "arktype";

import saihajPhoto from "./saihaj.webp";

const StaticImageData = type({
  "blurDataURL?": "string",
  "height?": "number",
  src: "string",
  "width?": "number",
});

export const Author = type({
  "avatar?": type("string").or(StaticImageData),
  "github?": "string",
  link: "string",
  name: "string",
});

export type Author = typeof Author.infer;

export const authors: Record<string, Author> = {
  adam: {
    github: "adambenhassen",
    link: "https://github.com/adambenhassen",
    name: "Adam Benhassen",
  },
  aleksandra: {
    github: "beerose",
    link: "https://x.com/aleksandrasays",
    name: "Aleksandra Sikora",
  },
  arda: {
    github: "ardatan",
    link: "https://twitter.com/ardatanrikulu",
    name: "Arda Tanrikulu",
  },
  denis: {
    github: "enisdenjo",
    link: "https://github.com/enisdenjo",
    name: "Denis Badurina",
  },
  dimitri: {
    github: "dimaMachina",
    link: "https://x.com/dimaMachina_",
    name: "Dimitri Postolov",
  },
  dotan: {
    github: "dotansimha",
    link: "https://github.com/dotansimha",
    name: "Dotan Simha",
  },
  enisdenjo: {
    github: "enisdenjo",
    link: "https://twitter.com/enisdenjo",
    name: "Denis Badurina",
  },
  gil: {
    github: "gilgardosh",
    link: "https://github.com/gilgardosh",
    name: "Gil Gardosh",
  },
  jason: {
    github: "jasonkuhrt",
    link: "https://github.com/jasonkuhrt",
    name: "Jason Kuhrt",
  },
  jdolle: {
    github: "jdolle",
    link: "https://github.com/jdolle",
    name: "Jeff Dolle",
  },
  jiri: {
    github: "capaj",
    link: "https://x.com/capajj",
    name: "Jiri Spac",
  },
  kamil: {
    github: "kamilkisiela",
    link: "https://x.com/kamilkisiela",
    name: "Kamil Kisiela",
  },
  laurin: {
    github: "n1ru4l",
    link: "https://twitter.com/n1rual",
    name: "Laurin Quast",
  },
  michael: {
    github: "mskorokhodov",
    link: "https://github.com/mskorokhodov",
    name: "Michael Skorokhodov",
  },
  saihaj: {
    avatar: saihajPhoto,
    github: "saihaj",
    link: "https://github.com/saihaj",
    name: "Saihajpreet Singh",
  },
  tuval: {
    github: "TuvalSimha",
    link: "https://github.com/tuvalsimha",
    name: "Tuval Simha",
  },
  uri: {
    github: "Urigo",
    link: "https://github.com/Urigo",
    name: "Uri Goldshtein",
  },
  valentin: {
    github: "EmrysMyrddin",
    link: "https://github.com/EmrysMyrddin",
    name: "Valentin Cocaud",
  },
};
