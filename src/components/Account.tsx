'use client'
import { useEffect, useState } from 'react';
import { getBalance } from 'viem/actions';
import { mainnet } from 'viem/chains';
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import { config } from '../../config';
import { createPublicClient, http } from 'viem';

export function Account() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const formattedAddress = formatAddress(address);
  const GetAcounts = async ()=>{
    const accounts = await connector?.getAccounts();
    console.log(accounts);
  }

  const FetchBalance = async ()=>{
    const client = createPublicClient({
      transport: http(),
      chain: mainnet
    });
    const required_address = address || '0x4557B18E779944BFE9d78A672452331C186a9f48';
    const balance = await getBalance(client, {
      address:  required_address,
    });
    console.log(balance);
  }
  useEffect(()=>{
    GetAcounts();
    FetchBalance();
  },[])
  return (
    <div className="row">
      <div className="inline">
        {ensAvatar ? (
          <img alt="ENS Avatar" className="avatar" src={ensAvatar} />
        ) : (
          <div className="avatar" />
        )}
        <div className="stack">
          {address && (
            <div className="text">
              {ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
            </div>
          )}
          <div className="subtext">
            Connected to {connector?.name}
          </div>
        </div>
      </div>
      <button className="button" onClick={() => disconnect()} type="button">
        Disconnect
      </button>
    </div>
  );
}

function formatAddress(address?: string) {
  if (!address) return null;
  return `${address.slice(0, 6)}…${address.slice(38, 42)}`;
}
