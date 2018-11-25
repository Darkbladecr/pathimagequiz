import { login, upvote, user } from './user';
import { images } from './image';

const resolvers = {
  Query: {
    user,
    images,
  },
  Mutation: {
    login,
    upvote,
  },
};

export default resolvers;
