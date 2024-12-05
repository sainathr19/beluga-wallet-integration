'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BELUGA_ABI, BELUGA_CONTRACT_ADDRESS } from '@/constants/beluga'
import { useReadContract } from 'wagmi'
import { Copy } from "lucide-react"
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'

const TokenInfo = () => {
  const { toast } = useToast();
  
  const { data: name } = useReadContract({
    address: BELUGA_CONTRACT_ADDRESS,
    abi: BELUGA_ABI,
    functionName: 'name',
  }) as { data: string }

  const { data: symbol } = useReadContract({
    address: BELUGA_CONTRACT_ADDRESS,
    abi: BELUGA_ABI,
    functionName: 'symbol',
  }) as { data: string }

  const { data: owner } = useReadContract({
    address: BELUGA_CONTRACT_ADDRESS,
    abi: BELUGA_ABI,
    functionName: 'owner',
  }) as { data: `0x${string}` }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  }

  return (
    <Card className="bg-white shadow-sm rounded-lg border border-slate-200">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500">Token Name</p>
            <p className="font-medium text-base text-slate-900">{name || 'Loading...'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500">Symbol</p>
            <p className="font-medium text-base text-slate-900">{symbol || 'Loading...'}</p>
          </div>
          <div className="col-span-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500">Contract Address</p>
            <div className="flex items-center justify-between">
              <p className="font-medium text-base text-slate-900">
                {`${BELUGA_CONTRACT_ADDRESS.slice(0, 6)}...${BELUGA_CONTRACT_ADDRESS.slice(-4)}`}
              </p>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 hover:bg-slate-200 rounded-full"
                onClick={() => handleCopyAddress(BELUGA_CONTRACT_ADDRESS)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {owner && (
            <div className="col-span-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500">Owner Address</p>
              <div className="flex items-center justify-between">
                <p className="font-medium text-base text-slate-900">
                  {`${owner.slice(0, 6)}...${owner.slice(-4)}`}
                </p>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6 hover:bg-slate-200 rounded-full"
                  onClick={() => handleCopyAddress(owner)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TokenInfo 