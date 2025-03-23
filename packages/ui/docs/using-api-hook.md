# Using the useApi Hook

The `useApi` hook provides a convenient way to interact with the Polkadot API in your application. It leverages our existing provider structure while offering an interface similar to other API hooks you might be familiar with.

## Basic Usage

```tsx
import { useApi } from "@/hooks/useApi";

function MyComponent() {
  const { 
    api, 
    chainInfo, 
    apiDescriptor, 
    compatibilityToken,
    isApiReady,
    isChainReady,
    error 
  } = useApi();

  // Check if API is ready before using it
  if (!isApiReady) {
    return <div>Loading API...</div>;
  }

  // Check for connection errors
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Now you can safely use the API to interact with the chain
  useEffect(() => {
    const fetchBlockNumber = async () => {
      try {
        const header = await api.query.System.Number(compatibilityToken);
        console.log(`Current block number: ${header}`);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchBlockNumber();
  }, [api, compatibilityToken]);

  return (
    <div>
      <h1>Connected to {apiDescriptor} chain</h1>
      <p>Token Symbol: {chainInfo?.tokenSymbol}</p>
      {/* Other chain info */}
    </div>
  );
}
```

## Available Properties

The `useApi` hook provides the following properties:

- **api**: The Polkadot API instance that you can use to interact with the chain
- **apiDescriptor**: The identifier for the API (e.g., "dot" for Polkadot)
- **chainInfo**: Information about the connected chain such as token decimals, symbol, etc.
- **client**: The raw Polkadot client instance
- **compatibilityToken**: Token required for API calls
- **resetApi**: Function to reset the API connection
- **isApiReady**: Boolean indicating if the API is ready to use
- **isChainReady**: Boolean indicating if chain information is loaded
- **error**: Error object if there was a connection problem

## Connection States

The hook provides helpful flags to handle different connection states:

```tsx
const { isApiReady, isChainReady, error } = useApi();

// Loading state
if (!isApiReady) {
  return <Loader />;
}

// Error state
if (error) {
  return <ErrorMessage message={error.message} />;
}

// API is ready, but chain info might not be loaded yet
if (!isChainReady) {
  return <div>Connected, loading chain information...</div>;
}

// Everything is ready!
return <YourComponent />;
```

## Chain Information

The `chainInfo` object contains useful metadata about the connected chain:

```tsx
const { chainInfo } = useApi();

// Access chain info properties
const {
  ss58Format,  // The SS58 address format for the chain
  tokenDecimals, // Decimals used for the native token
  tokenSymbol,  // Symbol for the native token (e.g., "DOT")
  isEthereum    // Whether the chain is Ethereum-compatible
} = chainInfo || {};
```

## Type Safety with API Descriptors

For advanced use cases, you can ensure type safety by checking the API descriptor:

```tsx
import { useApi, isContextOf } from "@/hooks/useApi";

function MyComponent() {
  const api = useApi();

  if (isContextOf(api, "dot")) {
    // This code will only run if connected to Polkadot
    // api will be typed correctly for Polkadot
  }
}
```

## Example Component

Check out the `ApiExample.tsx` component in the components/examples directory for a complete example of using the hook to display chain information and current block number.

## Integration with Existing Providers

This hook seamlessly integrates with our existing provider structure:

1. The `ChainProvider` manages the API connection and chain information
2. The `useApi` hook accesses this information through the Provider
3. No additional setup is required beyond what's already in place

This approach maintains compatibility with your existing code while providing a familiar interface for API interactions. 