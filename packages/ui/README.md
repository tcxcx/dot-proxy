# DOT Proxy Gov

A self-hosted application for creating and managing governance proxies for Polkadot, allowing you to participate in OpenGov while keeping your DOT securely staked in cold/hot wallets (including Ledger devices).

![DOT Proxy Gov Screenshot](https://github.com/yourusername/dot-proxy-gov/raw/main/public/screenshot.png)

## Features

- 🔒 **Security-First Approach**: Keep your DOT staked while participating in governance 
- 🗳️ **Governance Proxy Management**: Create and manage proxies specifically for OpenGov voting
- 💼 **Ledger Hardware Support**: Connect your Ledger device for maximum security
- 🌐 **Self-Hosting Capabilities**: Deploy your own instance for maximum privacy and control
- 📊 **Referenda Overview**: View and interact with ongoing referenda
- 📜 **Transaction History**: Track your proxy creations and governance votes

## Why Use DOT Proxy Gov?

DOT Proxy Gov enables you to participate in the Polkadot governance system without needing to unstake your DOT or move funds from cold storage, enhancing both your security and governance participation.

With governance proxies, you can:
- Keep your main DOT holdings secure in cold storage or staked
- Vote on referenda through a proxy wallet with limited permissions
- Use different devices for governance without exposing your main keys
- Manage multiple proxy relationships from a single interface

## Self-Hosting Setup

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Git

### Local Development

1. Clone the repository

```bash
git clone https://github.com/yourusername/dot-proxy-gov.git
cd dot-proxy-gov
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Deployment

You can easily deploy this application to Vercel, Netlify, or any other Next.js-compatible hosting platform.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fdot-proxy-gov)

## Using a Custom RPC Node

For better privacy, you can connect to your own Polkadot RPC node by:

1. Adding a `?rpc=wss://your-node-url.com` parameter to the URL
2. Editing the `papi-config.ts` file to change the default endpoints

## Ledger Device Usage

To use your Ledger device with DOT Proxy Gov:

1. Make sure the latest version of the Polkadot (DOT) app is installed on your Ledger
2. Ensure Ledger Live is closed, as it may interfere with the connection
3. Use Chrome or Brave browsers for the best compatibility
4. Connect via a compatible wallet (Talisman recommended) or directly to Polkadot.js

## Security Considerations

- Governance proxies can only perform governance actions, not transfer funds
- Always verify transaction details on your Ledger device screen
- Only add proxy accounts that you fully control or trust
- Consider running your own RPC node for maximum privacy

## Technology Stack

- Next.js 14
- TypeScript
- Polkadot.js API / Polkadot API (new)
- Shadcn UI components
- TailwindCSS

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built using the [Polkadot Next.js Starter](https://github.com/niklasp/polkadot-nextjs-starter)
- Inspired by [Multix](https://github.com/Tbaut/Multix) multisignature and proxy management tool
- Polkadot Network and Parity Technologies

# Polkadot Governance Proxy App

This application allows users to manage proxy accounts for Polkadot governance and vote on referenda using those proxies. The implementation leverages the Polkadot API to directly connect to the chain.

## Features

- Connect to Polkadot network using Polkadot extension
- View and manage governance proxy accounts
- Browse ongoing and closed referenda
- Filter referenda by governance track
- Vote on referenda using proxy accounts with conviction voting

## Technical Implementation

### API Connection

The application connects directly to Polkadot network nodes using:

- `polkadot-api` for API connectivity
- Direct use of the chain's RPC endpoints 
- Custom `useApi` hook that provides chain information and API access

### Governance Tracks

OpenGov referenda are organized by governance tracks, which determine the properties and requirements for each referendum. The application:

1. Fetches track information from the chain
2. Displays track information for each referendum
3. Allows filtering referenda by track
4. Ensures votes are cast on the correct track

### Referenda Handling

Referenda are fetched and processed through:

1. `useReferenda` hook - fetches multiple referenda with filtering options
2. `useReferendum` hook - fetches a single referendum with detailed information
3. `useGovernanceTracks` hook - fetches governance track information

### Proxy Voting

Voting through proxies is implemented via:

1. The Polkadot Governance proxy mechanism
2. `ConvictionVoting` module for applying voting conviction
3. Transaction handling with appropriate error fallbacks
4. Mock implementations for development where needed

## Development

The application uses mock data by default, but is structured to work with the real Polkadot API. The commented code in the hooks demonstrates how to transition from mock data to real API data.

## Configuration

The chain connection can be configured in the `papi-config.ts` file, which specifies:

- Chain name
- API descriptors
- RPC endpoints

## Contributing

To contribute to this project, please ensure all implementations use the direct API approach rather than GraphQL or other intermediary services.
