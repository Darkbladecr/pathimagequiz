import 'dotenv/config';
import { GraphQLServer } from 'graphql-yoga';
import { startDB, models } from './models';
import resolvers from './resolvers';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const mongo = startDB(process.env.MONGODB);

const getScope = token => {
  if (!token) {
    return null;
  }
  try {
    const user = jwt.verify(token, process.env.SECRET);
    return user;
  } catch (e) {
    return null;
  }
};

const context = req => {
  const headers = req.request.headers;
  const hasAuth = headers.hasOwnProperty('authorization');
  return {
    mongo,
    db: models,
    user: hasAuth ? getScope(headers.authorization) : null,
  };
};

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8'
);

const options = { port: 4000 };
const server = new GraphQLServer({ typeDefs, resolvers, context });
server.start(options, () =>
  console.log('Server is running on localhost:' + options.port)
);
