'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAccount, useWriteContract } from 'wagmi'
import { BELUGA_ABI, BELUGA_CONTRACT_ADDRESS } from '@/constants/beluga';
import { useToast } from '@/hooks/use-toast';


type Props = {}

const MintToken = (props: Props) => {
  const [mintAmount, setMintAmount] = useState('');
  const { address } = useAccount();
  const {data : hash ,isPending,isSuccess,isError, writeContract} = useWriteContract();
  const { toast } = useToast();

  const HandleMintClick = async () => {
    if (!mintAmount || !address) return;
    try {
      await writeContract({
        address: BELUGA_CONTRACT_ADDRESS,
        abi: BELUGA_ABI,
        functionName: 'mint',
        args: [address, Number(mintAmount)]
      });
    } catch (error : any) {
      toast({
        title: 'Error',
        description: error.message,
      });
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint BLG</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="number"
          placeholder="Enter amount to mint"
          value={mintAmount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMintAmount(e.target.value)}
        />
        <Button className="w-full" variant="default" onClick={HandleMintClick} disabled={isPending}>
          {isPending ? 'Minting...' : 'Mint Tokens'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default MintToken;
