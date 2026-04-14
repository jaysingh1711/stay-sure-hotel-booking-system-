import { MongoMemoryServer } from 'mongodb-memory-server';
(async () => {
  console.log("Starting MongoMemoryServer...");
  const mongoServer = await MongoMemoryServer.create();
  console.log("URI:", mongoServer.getUri());
  process.exit(0);
})();
