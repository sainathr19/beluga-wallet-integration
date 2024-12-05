'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BELUGA_ABI, BELUGA_CONTRACT_ADDRESS } from '@/constants/beluga';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useToast } from '@/hooks/use-toast';
import { Copy } from "lucide-react"

const TransferToken = () => {
  const [addressToTransfer, setAddressToTransfer] = useState('');
  const [amountToTransfer, setAmountToTransfer] = useState('');
  const { toast } = useToast();
  const { 
    data: hash,
    error,
    isPending, 
    writeContract 
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Add effect to handle success
  React.useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: "Transfer completed successfully!",
      });
      setAddressToTransfer('');
      setAmountToTransfer('');
    }
  }, [isSuccess, toast]);

  const HandleTransferClick = async () => {
    if (!addressToTransfer || !amountToTransfer) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter recipient address and amount",
      });
      return;
    }

    try {
      await writeContract({
        address: BELUGA_CONTRACT_ADDRESS,
        abi: BELUGA_ABI,
        functionName: 'transfer',
        args: [addressToTransfer, Number(amountToTransfer)]
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error?.message || "Failed to transfer tokens",
      });
    }
  }

  const handleCopyHash = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      toast({
        title: "Copied",
        description: "Transaction hash copied to clipboard",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Token</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Enter recipient address"
          value={addressToTransfer}
          onChange={(e) => setAddressToTransfer(e.target.value)}
        />
        <Input        
          type="number"
          placeholder="Enter amount"
          value={amountToTransfer}
          onChange={(e) => setAmountToTransfer(e.target.value)}
        />
        <Button 
          className="w-full" 
          variant="default" 
          onClick={HandleTransferClick} 
          disabled={isPending || isConfirming}
        >
          {isPending || isConfirming ? 'Transferring...' : 'Transfer Token'}
        </Button>
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        {hash && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Tx: {hash.slice(0, 6)}...{hash.slice(-4)}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleCopyHash}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        {isConfirming && <div className="text-sm">Waiting for confirmation...</div>}
        {isSuccess && <div className="text-sm text-green-500">Transaction confirmed!</div>}
        {error && (
          <div className="text-sm text-red-500">
            Error: {(error as { shortMessage?: string })?.shortMessage || error.message}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default TransferToken;
