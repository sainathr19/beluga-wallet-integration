'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAccount, useWriteContract } from 'wagmi'
import { BELUGA_ABI, BELUGA_CONTRACT_ADDRESS } from '@/constants/beluga';
import { useToast } from '@/hooks/use-toast';
type Props = {}

const BurnToken = (props: Props) => {
  const [burnAmount, setBurnAmount] = useState('');
  const { address } = useAccount();
  const {data : hash ,isPending,isSuccess,isError, writeContract} = useWriteContract();
  const { toast } = useToast();

  const HandleBurnClick = async () => {
    if (!burnAmount || !address) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter an amount and connect your wallet",
      });
      return;
    }

    try {
      await writeContract({
        address: BELUGA_CONTRACT_ADDRESS,
        abi: BELUGA_ABI,
        functionName: 'burn',
        args: [Number(burnAmount)]
      });

      if (isSuccess) {
        toast({
          title: "Success",
          description: "Tokens burned successfully!",
        });
        setBurnAmount('');
      }

      if (isError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to burn tokens. Please try again.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error?.message || "Something went wrong while burning tokens",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Burn BLG</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="number"
          placeholder="Enter amount to burn"
          value={burnAmount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBurnAmount(e.target.value)}
        />
        <Button className="w-full" variant="default" onClick={HandleBurnClick} disabled={isPending}>
          {isPending ? 'Burning...' : 'Burn Tokens'}
        </Button>
        {isError && <p className="text-red-500">Error burning tokens</p>}
        {isSuccess && <p className="text-green-500">Tokens burned successfully!</p>}
      </CardContent>
    </Card>
  )
}

export default BurnToken;
