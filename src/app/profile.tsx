'use client'

import { useAccount, useEnsName } from 'wagmi'
import { Account } from '../components/Account';

export function Profile() {
    const { isConnected } = useAccount();
    return (
      <div className="container">{isConnected ? <Account /> : <p>Connect your wallet to view your profile</p>}</div>
    );
}