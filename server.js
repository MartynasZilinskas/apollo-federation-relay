/**
 * Gateway server and main entrypoint
 */

const { ApolloGateway } = require('@apollo/gateway');
const { ApolloServer } = require('apollo-server');
const { server: serverProduct } = require('./server-product');
const { server: serverNode } = require('./server-node');

const BASE_PORT = 7000;

const SERVERS = [
  { name: '📦 product', server: serverProduct },
  { name: '🌝 node', server: serverNode },
];

async function startServers() {
  const res = SERVERS.map(async ({ server, name }, index) => {
    const number = index + 1;
    const info = await server.listen(BASE_PORT + number);

    console.log(`${name} up at ${info.url}graphql`);
    return { ...info, name, server };
  });

  return await Promise.all(res);
}

async function main() {
  const serviceList = await startServers();
  const gateway = new ApolloGateway({ serviceList });
  const server = new ApolloServer({ gateway, subscriptions: false });
  const info = await server.listen(BASE_PORT);

  console.log(`\n--\n\n🌍 gateway up at ${info.url}graphql`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});