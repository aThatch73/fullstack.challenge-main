/**
 * Database client
 * It's essentially a wrapper around Knex https://knexjs.org/
 */

import initKnex, { Knex } from "knex";
import Countries from "../../../lib/Countries";

import config from "../../config";
import type { Author, AuthorCriteria } from "../../types";

export * from "../../types";

export class DbRead {
  private knex: Knex;
  private countries: Countries;
  private readonly countriesWithAlternateNameOrder: string[] = ['Japan'];
  private readonly malePronouns: string[] = ['he', 'him', 'his'];
  private readonly femalePronouns: string[] = ['she', 'her', 'hers'];

  constructor() {
    this.knex = initKnex(config.development);
    this.countries = new Countries();
  }

  private async getCountryNameByCountryCode(code: string): Promise<string> {
    const data = await this.countries.searchByCountryCode(code);

    return data[0]?.name?.common;
  }

  private async mapAuthorCountryNames(authorsList: Author[]): Promise<Author[]> {
    return await Promise.all(authorsList.map(async author => {
      if (author.countryCode) {
        author.countryName = await this.getCountryNameByCountryCode(author.countryCode);
      }
      return author;
    }));
  }

  private mapAuthorPronouns(authorsList: Author[]): Author[] {
    return authorsList.map(auth => {
      if (auth.gender) {
        auth.pronouns = auth.gender === 'male' ? this.malePronouns : this.femalePronouns;
      }
      return auth;
    });
  }

  private mapAuthorDisplayNames(authorsList: Author[]): Author[] {
    return authorsList.map(auth => {
      auth.displayName = this.countriesWithAlternateNameOrder.includes(auth.countryName) ? `${auth.familyName} ${auth.givenName}` : `${auth.givenName} ${auth.familyName}`;
      return auth;
    });
  }

  private authorsQueryBuilder(criteria:AuthorCriteria) {
    if (!(criteria.id || (criteria.familyName && criteria.givenName))) {
      throw 'Insufficient Author Search Criteria:  Please provide either the author id, or the family and given name';
    }

    let query = this.knex.table<Author>("authors").select("*");

    if (criteria.id) {
      query = query.where('id', criteria.id);
    } else {
      query = query.where('familyName', criteria.familyName).andWhere('givenName', criteria.givenName);
    }

    return query;
  }

  private authorQueryBuilder(criteria: AuthorCriteria) {
    let query = this.knex.table<Author>("authors").select("*").offset(criteria?.offset || 0);
    if (criteria?.limit) {
      query = query.limit(criteria.limit);
    }
    
    return query;
  }

  private async mapFieldsToAuthors(authors: Author[]): Author[] {
    const authorsListWithCountryNames = await this.mapAuthorCountryNames(authors);
    const authorsListWithDisplayNames = this.mapAuthorDisplayNames(authorsListWithCountryNames);

    return this.mapAuthorPronouns(authorsListWithDisplayNames);
  }

  public async listAuthors(criteria: AuthorCriteria): Promise<Author[]> {
    const authorsList = await this.authorQueryBuilder(criteria);

    return this.mapFieldsToAuthors(authorsList);
  }

  public async getAuthor(criteria: AuthorCriteria): Promise<Author> {
    const authors: Author[] = await this.authorsQueryBuilder(criteria);
    const authorsWithMappedFields = await this.mapFieldsToAuthors(authors)

    return authorsWithMappedFields[0];
  }
}

export default new DbRead();
