'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { BELUGA_ABI, BELUGA_CONTRACT_ADDRESS } from '@/constants/beluga';

import { useToast } from '@/hooks/use-toast';

const ApproveToken = () => {
  const [amount, setAmount] = useState('');
  const [spenderAddress, setSpenderAddress] = useState('');
  const { address } = useAccount();
  const { toast } = useToast();
  const { data: hash, isPending, writeContract } = useWriteContract();

  // Wait for transaction to complete
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Add effect to handle success
  React.useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: "Approval successful!",
      });
      setAmount('');
      setSpenderAddress('');
    }
  }, [isSuccess, toast]);

  const handleApproveClick = async () => {
    if (!amount || !address || !spenderAddress) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter amount and spender address",
      });
      return;
    }

    try {
      // Ensure amount is a valid number
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid amount");
      }

      await writeContract({
        address: BELUGA_CONTRACT_ADDRESS,
        abi: BELUGA_ABI,
        functionName: 'approve',
        args: [spenderAddress, Number(amount)]
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error?.message || "Failed to approve tokens",
      });
    }
  }

  const isLoading = isPending || isConfirming;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approve Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Spender Address"
          value={spenderAddress}
          onChange={(e) => setSpenderAddress(e.target.value)}
        />
        <Input
          type="number"
          step="any"
          min="0"
          placeholder="Amount to approve"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button 
          className="w-full" 
          onClick={handleApproveClick} 
          disabled={isLoading}
        >
          {isLoading ? 'Approving...' : 'Approve'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default ApproveToken; 