# Configuring and Using Polkadot.js to Access Your Polkadot (DOT) Accounts

## "Ledger Error: Unknown Status Code: 28160" Issue

When your device cannot connect to the Polkadot.js extension, you may receive the error "Unknown Status Code: 28160".

The new Ledger Polkadot app currently does not work with the Polkadot.js browser extension. If you try to connect your Ledger device, you will receive the message "Unknown Status Code: 28160".

You can use it with the Polkadot.js web wallet (see instructions below) or with the Talisman wallet.

## Overview

This tutorial explains how to set up and use the Polkadot.js application with your Ledger device to access Polkadot (DOT) accounts on your Ledger wallet and unbond your staked DOT balance.

## Before You Begin

- Make sure the latest version of the Polkadot (DOT) app is installed on your Ledger device.
- Ensure Ledger Live is closed, as it may be incompatible with Polkadot.js.
- Please note that Polkadot.js does not support Ledger devices on Firefox. Be sure to use Chrome or Brave.

## Connecting Your Device to Polkadot.js

### Connect Your Ledger Device to the Polkadot.js Web Interface

1. Unlock your Ledger device and open the Polkadot app.
2. Go to Polkadot.js.
3. Select polkadot.js.org/apps/.
4. The following page may take some time to load.
5. Click on the Polkadot logo to open the side panel and verify that you are connected via Automata 1RPC.
6. Close the panel by clicking the (X) button.
7. Go to "Settings", select "Manage Hardware Connections", then choose one of the following options:
   - "Attach Ledger via WebUSB" if you are using Windows.
   - "Attach Ledger via WebHID" if you are using macOS or Linux.
8. Click Save.

## Adding Your First Ledger DOT Account

1. In the top header, go to "Accounts".
2. In the dropdown menu, click on "Accounts".
3. Select "Add via Ledger".
4. In the next menu, enter a name in the "Name" field, then leave the "Account type" and "Address index" fields as they are. Click "Save".
5. A popup window may appear.
6. To confirm the connection with your Ledger device, select your device, then click "Connect".
7. Your Ledger's Polkadot (DOT) account will be displayed.

## Adding New DOT Accounts on Your Ledger Device

If you have multiple Polkadot (DOT) accounts, follow these instructions to add them manually:

1. Select "Add via Ledger".
2. In the "Name" field, choose a different name for your second account.
3. In the "Account type" field, choose "Account type 1".
4. The default value (0) for the "Address index" field can be kept.
5. Click "Save".

Your second DOT account should now appear next to the first one. If you have a third account, follow the same procedure. This time, choose "Account type 2", and so on.

## Unbonding a Staked Balance via Polkadot.js

You can use Polkadot.js to unbond a staked balance (with ongoing nominations). Before unbonding, the staked balance must be "chilled":

1. In the Polkadot.js application, click on the Staking tab.
2. Select "Account Actions".
3. Your staking DOT balance(s) will be displayed.
4. Select your staked balance, click on "Stop nominating" and confirm the transaction on your Ledger device.
5. Your staked balance is now chilled and can be unbonded.

*(Source: Polkadot Wiki)*

6. Click on the three dots and select "Unbond funds".
7. Select the "amount" to unbond, then confirm the transaction on your Ledger device.
8. The unbonding process begins.

Please note that a 28-day period is required to unbond a DOT balance before you can withdraw it.

Once your DOT balance is unbonded, select "Withdraw unbonded funds" from the same menu to withdraw your DOT balance to your available balance.