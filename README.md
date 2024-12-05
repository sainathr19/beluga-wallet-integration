# Beluga Token

A simple UI for interacting with the Beluga Token (BLGT) smart contract. Built with Next.js, Wagmi, and Tailwind CSS.

## Features

- Secure wallet connection with multiple providers
- Token transfer functionality
- Token burning capability 
- Token minting
- Real-time token information display
- Allowance management


## Usage

1. Connect Wallet
- Click "Connect Wallet" button
- Select your preferred wallet provider
- Accept the connection request

2. View Token Info
- Token name and symbol
- Contract address
- Owner address

3. Transfer Tokens
- Enter recipient address
- Enter amount to transfer
- Confirm transaction in wallet

4. Manage Allowances
- Check current allowances
- Approve new spending limits
- View allowance history

5. Token Operations
- Mint new tokens
- Burn existing tokens

## Contract Integration

The dashboard interacts with Beluga Token deployed on Sepolia testnet. Key functions:
- transfer
- transferFrom
- approve
- mint
- burn
- allowance
