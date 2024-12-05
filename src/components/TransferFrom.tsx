'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAccount, useWriteContract } from 'wagmi'
import { BELUGA_ABI, BELUGA_CONTRACT_ADDRESS } from '@/constants/beluga';
import { useToast } from '@/hooks/use-toast';

const TransferFrom = () => {
  const [amount, setAmount] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const { address } = useAccount();
  const { toast } = useToast();
  const { isPending, writeContract } = useWriteContract();

  const handleTransferFromClick = async () => {
    if (!amount || !fromAddress || !toAddress) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all fields",
      });
      return;
    }

    try {
      await writeContract({
        address: BELUGA_CONTRACT_ADDRESS,
        abi: BELUGA_ABI,
        functionName: 'transferFrom',
        args: [fromAddress, toAddress, Number(amount)]
      });

      toast({
        title: "Success",
        description: "Transfer successful!",
      });
      setAmount('');
      setFromAddress('');
      setToAddress('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error?.message || "Failed to transfer tokens",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer From</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="From Address"
          value={fromAddress}
          onChange={(e) => setFromAddress(e.target.value)}
        />
        <Input
          placeholder="To Address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Amount to transfer"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button 
          className="w-full" 
          onClick={handleTransferFromClick} 
          disabled={isPending}
        >
          {isPending ? 'Transferring...' : 'Transfer'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default TransferFrom; 