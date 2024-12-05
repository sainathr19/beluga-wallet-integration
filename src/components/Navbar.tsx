"use client"
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

const Navbar = () => {
    const { isConnected,address } = useAccount();
    const { disconnect } = useDisconnect();
    const { toast } = useToast();

    const handleCopyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            toast({
                title: "Copied",
                description: "Wallet address copied to clipboard",
            });
        }
    };

    return <div className="px-4 py-3 bg-white/50 backdrop-blur-sm shadow-md flex justify-between items-center">
        <div>
            <p className="text-2xl font-medium">Beluga Token</p>
        </div>
        <div>
            {isConnected ? <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <p className="text-sm font-medium">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={handleCopyAddress}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => disconnect()}
                >
                    Disconnect
                </Button>
            </div> : <Link href={"/connect"}>
                <Button variant="default" size="sm">
                    Connect Wallet
                </Button>
            </Link>}
        </div>
    </div>;
};

export default Navbar;
