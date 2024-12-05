'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BELUGA_ABI, BELUGA_CONTRACT_ADDRESS } from '@/constants/beluga';
import { createPublicClient, formatEther, http } from 'viem';
import { sepolia } from 'viem/chains';

const CheckBalance = () => {
  const [addressToCheck, setAddressToCheck] = useState('');
  const [balance, setBalance] = useState<bigint>();
  const [isLoading, setIsLoading] = useState(false);

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const HandleCheckBalanceClick = async () => {
    if (!addressToCheck) return;
    setIsLoading(true);
    try {
      const data = await publicClient.readContract({
        address: BELUGA_CONTRACT_ADDRESS,
        abi: BELUGA_ABI,
        functionName: "balanceOf",
        args: [addressToCheck],
      });
      setBalance(data as bigint);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Enter address to check"
          value={addressToCheck}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressToCheck(e.target.value)}
        />
        <Button className="w-full" variant="default" onClick={HandleCheckBalanceClick} disabled={isLoading}>
            {isLoading ? 'Checking...' : 'Check Balance'}
        </Button>
        {balance && <p>Balance: {balance.toString()}</p>}
      </CardContent>
    </Card>
  )
}

export default CheckBalance;
