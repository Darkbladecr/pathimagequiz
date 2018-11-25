import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { authControl } from '../auth';
import ScreenLoader from '../loader';
import Quiz from './quiz';

export const IMAGES_QUERY = gql`
  query QuizQuery($_id: String!) {
    images {
      _id
      url
    }
    user(_id: $_id) {
      marksheet {
        image
        choice
        vessels
      }
    }
  }
`;

const QuizQuery = () => {
  const { _id } = authControl.decoded;

  return (
    <Query query={IMAGES_QUERY} variables={{ _id }}>
      {({ loading, error, data }) => {
        if (loading) return <ScreenLoader />;
        if (error) return `${error.message}`;
        const { marksheet } = data.user;
        const { images } = data;

        return <Quiz marksheet={marksheet} images={images} />;
      }}
    </Query>
  );
};

export default QuizQuery;
