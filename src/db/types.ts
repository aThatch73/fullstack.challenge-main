/**
 * Typings of data stored in DB
 */

export type Author = {
  id: number;
  givenName: string;
  familyName: string;
  displayName: string;
  countryName: string;
  gender: string | null;
  pronouns: string[] | null;
  countryCode: string | null; // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
};

export type AuthorCriteria = {
  id?: number;
  givenName?: string;
  familyName?: string;
  offset?: number;
  limit?: number;
}
