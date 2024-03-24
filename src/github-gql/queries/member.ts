import { gql } from '@urql/core';

export const queryMember = gql`
  query GetMember($login: String!) {
    user(login: "$login") {
      id
      name
      anyPinnableItems
      avatarUrl
      bioHTML
      companyHTML
      email
      followers(first: 10) {
        nodes {
          id
          name
          avatarUrl
          bioHTML
          companyHTML
          email
        }
      }
    }
  }
`;
