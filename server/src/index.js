import 'dotenv/config';
console.log(process.env.MONGODB);
import { GraphQLServer } from 'graphql-yoga';
import { startDB, models } from './models';

const db = startDB(process.env.MONGODB);

const context = {
  models,
  db,
};

const sampleItems = [
  { name: 'Apple' },
  { name: 'Banana' },
  { name: 'Orange' },
  { name: 'Melon' },
];

const typeDefs = `
  type Query {
    items: [Item!]!
  }
  type Item {
    name: String!
  }
`;

const resolvers = {
  Query: {
    items: () => sampleItems,
  },
};

const options = { port: 4000 };
const server = new GraphQLServer({ typeDefs, resolvers, context });
server.start(options, () =>
  console.log('Server is running on localhost:' + options.port)
);
