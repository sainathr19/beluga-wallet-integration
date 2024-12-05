'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAccount } from 'wagmi'
import { readContract } from 'viem/actions'
import { publicClient } from '@/lib/viem'
import { BELUGA_ABI, BELUGA_CONTRACT_ADDRESS } from '@/constants/beluga';
import { formatEther } from 'viem';

const CheckAllowance = () => {
  const [spenderAddress, setSpenderAddress] = useState('');
  const [allowance, setAllowance] = useState<bigint>();
  const [isError, setIsError] = useState(false);
  const { address } = useAccount();

  const HandleCheckAllowanceClick = async () => {
    if (!address || !spenderAddress) return;
    
    try {
      const result = await readContract(publicClient, {
        address: BELUGA_CONTRACT_ADDRESS,
        abi: BELUGA_ABI,
        functionName: 'allowance',
        args: [address, spenderAddress],
      });
      
      setAllowance(result as bigint);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setAllowance(undefined);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Allowance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter spender address to check allowance"
          value={spenderAddress}
          onChange={(e) => setSpenderAddress(e.target.value)}
        />
        <Button 
          className="w-full" 
          onClick={HandleCheckAllowanceClick}
        >
          Check Allowance
        </Button>
        {allowance !== undefined && !isError && (
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Address {spenderAddress.slice(0, 6)}...{spenderAddress.slice(-4)} can spend
            </p>
            <p className="text-lg font-bold">
              {Number(allowance)} BLG
            </p>
            <p className="text-sm text-muted-foreground">
              from your wallet
            </p>
          </div>
        )}
        {isError && (
          <p className="text-center text-red-500">Error checking allowance</p>
        )}
      </CardContent>
    </Card>
  )
}

export default CheckAllowance;