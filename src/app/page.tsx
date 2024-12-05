'use client'

import { useAccount, useBalance } from 'wagmi'
import { BELUGA_ABI, BELUGA_CONTRACT_ADDRESS } from '@/constants/beluga'
import TransferToken from '@/components/TransferToken'
import BurnToken from '@/components/BurnToken'
import MintToken from '@/components/MintToken'
import { useWatchContractEvent } from 'wagmi'
import CheckAllowance from '@/components/CheckAllowance'
import ApproveToken from '@/components/ApproveToken'
import TransferFrom from '@/components/TransferFrom'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import TokenInfo from '@/components/TokenInfo'

export default function App() {
  const { address } = useAccount();
  const isAuthenticated = useAuth();
  const { data: balance, isLoading, isError, refetch } = useBalance({
    address,
    token: BELUGA_CONTRACT_ADDRESS,
  });

  useWatchContractEvent({
    address: BELUGA_CONTRACT_ADDRESS,
    abi: BELUGA_ABI,
    eventName: 'Transfer',
    onLogs: () => {
      refetch();
    },
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Image
              src="/beluga.png"
              alt="Beluga Token"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold mb-2">Beluga Token</h1>
        </div>
        <div className="mb-8 bg-white px-6 py-4 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-medium mb-2">Your Token Balance</h2>
          <div className="text-gray-600">
            {isLoading ? (
              <p>Loading...</p>
            ) : isError ? (
              <p className="text-red-500">Error loading balance</p>
            ) : (
              <p className="text-3xl font-semibold">
                {balance ? `${balance.formatted} ${balance.symbol}` : "0 BLG"}
              </p>
            )}
          </div>
        </div>

        <div className="mb-8">
          <TokenInfo />
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Token Management */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Tokens</h2>
            <div className="space-y-4">
              <MintToken />
              <BurnToken />
            </div>
          </div>

          {/* Transfer Operations */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Transfer</h2>
            <div className="space-y-4">
              <TransferToken />
              <TransferFrom />
            </div>
          </div>

          {/* Allowance Management */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Allowance</h2>
            <div className="space-y-4">
              <CheckAllowance />
              <ApproveToken />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600">
          <p>Beluga Token (BLGT) - Created by sainathr19</p>
        </footer>
      </div>
    </div>
  );
}