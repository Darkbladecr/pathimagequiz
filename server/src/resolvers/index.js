import { login, upvote, user } from './user';
import { images } from './image';

const sampleItems = [
  { name: 'Apple' },
  { name: 'Banana' },
  { name: 'Orange' },
  { name: 'Melon' },
];

const resolvers = {
  Query: {
    user,
    items: () => sampleItems,
    images,
  },
  Mutation: {
    login,
    upvote,
  },
};

export default resolvers;
