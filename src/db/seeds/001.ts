/**
 * Initial seed data inserted in DB
 */

import type { Knex } from "knex";

export async function seed(knex: Knex) {
  await knex("authors").delete();

  await knex("authors").insert([
    {
      givenName: "Joan",
      familyName: "Didion",
      countryCode: "US",
      gender: "female",
    },
    {
      givenName: "Paul",
      familyName: "Beatty",
      countryCode: "US",
      gender: "male",
    },
    {
      givenName: "Émile",
      familyName: "Zola",
      countryCode: "FR",
      gender: "male",
    },
    {
      givenName: "Haruki",
      familyName: "Murakami",
      countryCode: "JP",
      gender: "male",
    },
    {
      givenName: "Virginia",
      familyName: "Woolf",
      countryCode: "GB",
      gender: "female",
    },
    {
      givenName: "Gabriel",
      familyName: "García Márquez",
      countryCode: "CO",
      gender: "male",
    },
    {
      givenName: "Fatou",
      familyName: "Diome",
      countryCode: "FR",
      gender: "female",
    },
    {
      givenName: "Thomas",
      familyName: "Mann",
      countryCode: "DE",
      gender: "male",
    },
    {
      givenName: "Chimamanda",
      familyName: "Adichie",
      countryCode: "NG",
      gender: "female",
    },
  ]);
}
