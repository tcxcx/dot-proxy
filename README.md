# DOT Proxy Gov

A self-hosted application for creating and managing governance proxies for Polkadot, allowing you to participate in OpenGov while keeping your DOT securely staked in cold/hot wallets (including Ledger devices).

## Quick Start (No TypeScript Checks)

```bash
# Make sure Docker is running on your machine, then run:
bun run docker:build-and-run

# Check the logs
bun run docker:logs
```

Then visit http://localhost:3000 to see the application.

## Common Issues & Quick Fixes

**Problem**: Error with TypeScript or ESLint errors during build

**Solution**:
```bash
# Use the no-TypeScript-check build command
bun run docker:build-nots

# Start the services
bun run docker:up
```

**Problem**: Docker build still fails with TypeScript errors 

**Solution**: 
```bash
# Clean Docker cache first
bun run docker:clean

# Then build without TypeScript checks
bun run docker:build-nots

# Start the services
bun run docker:up
```

**Problem**: UI container builds but site doesn't load

**Solution**: Check the logs to see if the GraphQL service is running:
```bash
bun run docker:logs
```

## Prerequisites

- [Bun](https://bun.sh/) for UI development
- Node.js 16+ for the Squid indexer
- Docker and Docker Compose for running the database and containers
- Git

## Project Structure

The project is organized as a monorepo with two main components:

- **packages/ui**: Next.js frontend application (managed with Bun)
- **packages/squid**: Subsquid indexer (managed with npm)

## Running with Docker (Recommended)

The simplest way to run the entire application is with Docker:

```bash
# Make sure Docker is running on your machine
# Clone the repository and navigate to the project directory
git clone https://github.com/yourusername/dot-proxy-gov.git
cd dot-proxy-gov

# Start all services with Docker Compose
docker compose up -d

# Check logs to see if all services started properly
docker compose logs -f
```

This will start:
- PostgreSQL database
- Squid processor for blockchain indexing
- GraphQL API server
- Next.js frontend

Visit http://localhost:3000 to access the application.

## Manual Development Setup

If you prefer to run components manually for development:

### 1. Install Dependencies

```bash
# Install root dependencies
bun install
```

### 2. Set Up the Database and Squid Indexer

First, make sure Docker is running on your machine, then:

```bash
# Start the database
bun run docker:db

# Set up the squid (install dependencies, generate code, build)
bun run setup:squid

# Run database migrations
bun run db:migrate
```

### 3. Start the Backend Services

```bash
# In one terminal, start the processor
bun run processor:start

# In another terminal, start the GraphQL server
bun run graphql:start
```

### 4. Start the UI Development Server

```bash
# In a third terminal, start the UI
bun run dev:ui
```

Visit http://localhost:3000 to see the application.

## Commands

### Development
- `bun run dev:ui`: Start the UI development server
- `bun run build:ui`: Build the UI for production
- `bun run setup:squid`: Set up the squid (install, build, codegen)
- `bun run db:migrate`: Run database migrations
- `bun run processor:start`: Start the squid processor
- `bun run graphql:start`: Start the GraphQL server

### Docker
- `bun run docker:db`: Start only the database in Docker
- `bun run docker:up`: Start all services in Docker
- `bun run docker:down`: Stop all Docker services
- `bun run docker:logs`: View Docker logs

### Troubleshooting
- `bun run docker:rebuild`: Rebuild all Docker containers without cache
- `bun run docker:restart`: Restart all Docker containers
- `bun run docker:clean`: Clean Docker system (remove unused images, containers)
- `bun run docker:rebuild-ui`: Rebuild only the UI container

## Troubleshooting

### Docker Build Issues

If you're having issues with Docker builds, particularly with the UI container, try:

1. Make sure you're using the latest Docker version
2. Clean your Docker cache: `bun run docker:clean`
3. Rebuild the UI container: `bun run docker:rebuild-ui` 
4. Restart all services: `bun run docker:restart`

Common errors and solutions:

- **Error with `bun papi`**: We handle this in the Dockerfile, but if you still face issues, you can try:
  ```bash
  cd packages/ui
  bun install
  PAPI_SKIP_GENERATE=1 bun install
  bun papi
  ```

- **Missing network errors**: Make sure all services are on the same network in docker-compose.yml

### Docker Not Running

If you see an error like "Cannot connect to the Docker daemon", make sure Docker is running on your machine.

### Build Errors with Squid

If you encounter build errors with the squid, try:

```bash
cd packages/squid
npm install
npm run codegen
npm run build
npm run db:migrate
```

### UI Errors

If you encounter errors with the UI, try:

```bash
cd packages/ui
bun install
bun run dev
```

## Features

- 🔒 **Security-First Approach**: Keep your DOT staked while participating in governance 
- 🗳️ **Governance Proxy Management**: Create and manage proxies for OpenGov voting
- 💼 **Ledger Hardware Support**: Connect your Ledger device for maximum security
- 🌐 **Self-Hosting Capabilities**: Deploy your own instance for privacy and control
- 📊 **Referenda Overview**: View and interact with ongoing referenda
- 📜 **Transaction History**: Track your proxy operations and votes
- 🔐 **Multisig Support**: Create and manage multisig accounts

## Local Development Setup

### Prerequisites

- Node.js (v16 or later)
- npm, yarn, or pnpm
- Docker and Docker Compose
- Git

### Starting the Development Environment

1. Clone the repository
```bash
git clone https://github.com/yourusername/dot-proxy-gov.git
cd dot-proxy-gov
```

2. Install dependencies
```bash
npm install
```

3. Start the database and squid indexer using Docker
```bash
npm run docker:up
```

4. Start the UI development server
```bash
npm run dev:ui
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Component Description

#### UI (Next.js Frontend)

The UI is built with Next.js and includes components for:
- Governance proxy management
- Referendum voting
- Transaction history
- Ledger hardware wallet connection
- Multisig account management

#### Squid (Blockchain Indexer)

The Squid indexer processes blockchain events related to:
- Referenda submissions and voting
- Proxy creation and management
- Multisig account operations
- Transaction history

The indexer exposes a GraphQL API used by the UI to retrieve on-chain data.

## Production Deployment

### Docker Compose (Recommended)

Deploy the entire stack with Docker Compose:

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

This will deploy:
- PostgreSQL database
- Squid indexer processor
- GraphQL API server
- Next.js frontend

### Vercel Deployment (UI Only)

You can deploy just the UI to Vercel:

1. Configure the environment variable `NEXT_PUBLIC_SQUID_URL` to point to your deployed Squid GraphQL endpoint
2. Deploy to Vercel through their GitHub integration

## Environment Variables

### UI (.env.local)
```
NEXT_PUBLIC_SQUID_URL=http://localhost:4350/graphql
```

### Squid (.env)
```
DB_NAME=dot_proxy_gov
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_HOST=localhost
GQL_PORT=4350

# Polkadot Archive
BLOCK_START=0
RPC_WS=wss://rpc.polkadot.io
CHAIN_ID=polkadot
```

## Credits

- Built using the [Polkadot Next.js Starter](https://github.com/niklasp/polkadot-nextjs-starter)
- Inspired by [Multix](https://github.com/Tbaut/Multix) multisignature and proxy management tool
- Built with [Subsquid](https://www.subsquid.io/) for efficient blockchain data indexing 