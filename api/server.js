import Hapi from '@hapi/hapi';
import { plugin as shiftsMockApi } from './shifts-mock-api';

const server = Hapi.server({
  host: '127.0.0.1',
  port: '8080',
  routes: {
    cors: { origin: ['*'] },
  },
});

async function main() {
  try {
    await server.register({
      plugin: shiftsMockApi,
      routes: { prefix: '/shifts' },
    });

    await server.start();
    console.info(`✅  API server is listening at ${server.info.uri.toLowerCase()}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

main();
