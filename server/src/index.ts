import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs } from './schema/typeDefs';
import { resolvers, AppContext } from './resolvers';
import { connectDB } from './db';
import { createOwnerLoader } from './dataloaders/ownerLoader';

async function bootstrap() {
  await connectDB();

  const app = express();

  const server = new ApolloServer<AppContext>({ typeDefs, resolvers });
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({ ownerLoader: createOwnerLoader() }),
    })
  );

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  const port = process.env.PORT ?? 4000;
  app.listen(port, () => console.log(`Server ready at http://localhost:${port}/graphql`));
}

bootstrap().catch(console.error);
