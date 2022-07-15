/**
 * Graph definitions and corresponding resolvers
 */

import { gql } from "apollo-server";

import type { Author, AuthorCriteria } from "../db/types";
import DbRead from "../db/services/read";
import DbWrite from "../db/services/write";

export const typeDefs = gql`
  type AuthorRead {
    id: ID!
    givenName: String!
    familyName: String!
    displayName: String
    countryCode: String
    countryName: String
    gender: String
    pronouns: [String]
  }

  input AuthorCriteria {
    id: ID
    givenName: String
    familyName: String
    offset: Int
    limit: Int
  }
  
  input AuthorWrite {
    id: ID
    givenName: String!
    familyName: String!
    countryCode: String
    gender: String
  }

  type Query {
    authors(criteria: AuthorCriteria): [AuthorRead!]!
    author(criteria: AuthorCriteria): AuthorRead
  }

  type Mutation {
    createAuthor(author: AuthorWrite!): [Int]
    editAuthor(author: AuthorWrite!): Int
  }
`;

export const resolvers = {
  Query: {
    authors: (_, { criteria }: Record<string, AuthorCriteria>): Promise<Author[]> => {
      return DbRead.listAuthors(criteria);
    },
    author: (_, { criteria }: Record<string, AuthorCriteria>): Promise<Author> => {
      return DbRead.getAuthor(criteria);
    }
  },
  Mutation: {
    createAuthor: (_, { author }: Record<string, Author>): Promise<number[]> => {
      return DbWrite.createAuthor(author);
    },
    editAuthor: (_, { author }: Record<string, Author>): Promise<number> => {
      return DbWrite.editAuthor(author);
    }
  }
};
