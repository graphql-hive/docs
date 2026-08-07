interface Author {
  github: string;
  link: string;
  name: string;
}

const authors: Record<string, Author> = {
  adam: author("Adam Benhassen", "adambenhassen"),
  aleksandra: author("Aleksandra Sikora", "beerose"),
  arda: author("Arda Tanrikulu", "ardatan"),
  denis: author("Denis Badurina", "enisdenjo"),
  dimitri: author("Dimitri Postolov", "dimaMachina_"),
  dotan: author("Dotan Simha", "dotansimha"),
  enisdenjo: author("Denis Badurina", "enisdenjo"),
  iha: author("Iha Shin", "XiNiHa"),
  jdolle: author("Jeff Dolle", "jdolle"),
  jiri: author("Jiri Spac", "capaj"),
  jonathanawesome: author("Jonathan Brennan", "jonathanawesome"),
  kamil: author("Kamil Kisiela", "kamilkisiela"),
  laurin: author("Laurin Quast", "n1ru4l"),
  michael: author("Michael Skorokhodov", "mskorokhodov"),
};

function author(name: string, github: string): Author {
  return { github, link: `https://github.com/${github}`, name };
}

export function resolveAuthor(value: string | { name: string }): Author {
  const key = typeof value === "string" ? value : value.name;
  return authors[key] ?? author(key, key);
}
