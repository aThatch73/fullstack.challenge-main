/**
 * Database client
 * It's essentially a wrapper around Knex https://knexjs.org/
 */

import initKnex, { Knex } from "knex";

import config from "../../config";
import type { Author, AuthorCriteria } from "../../types";

export * from "../../types";

export class DbWrite {
  private knex: Knex;

  constructor() {
    this.knex = initKnex(config.development);
  }

  public async createAuthor(author: Author): Promise<number[]> {
    const authorRow = await this.knex.table<Author>("authors").insert(author);

    return authorRow;
  }

  public async editAuthor(author: Author): Promise<number> {
    const authorRow = await this.knex.table<Author>("authors").update(author).where('id', author.id);

    return authorRow;
  }
}

export default new DbWrite();
