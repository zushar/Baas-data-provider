import { gql } from '@urql/core';

export const queryProjectDetails = gql`
  query GetProject($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
      openGraphImageUrl
      description
      url
      createdAt
      updatedAt
      stargazerCount
      languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
        edges {
          node {
            name
          }
        }
      }
      collaborators {
        totalCount
      }
      contributors: mentionableUsers(first: 5) {
        edges {
          node {
            avatarUrl
            login
          }
        }
      }
    }
  }
`;
