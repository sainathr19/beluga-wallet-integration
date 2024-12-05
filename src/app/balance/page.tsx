'use client'
import { BELUGA_ABI, BELUGA_CONTRACT_ADDRESS } from "@/constants/beluga";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { useAccount } from "wagmi";

const ViewBalance = () => {
    const { address } = useAccount();
    const [balance, setBalance] = useState<bigint>();
    const [isLoading, setIsLoading] = useState(true);

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
    });

    const fetchBalance = async () => {
        if (!address) {
            setIsLoading(false);
            return;
        }
        
        try {
            setIsLoading(true);
            const data = await publicClient.readContract({
                address: BELUGA_CONTRACT_ADDRESS,
                abi: BELUGA_ABI,
                functionName: "balanceOf",
                args: [address],
            });
            setBalance(data as bigint);
        } catch (error) {
            console.error("Error fetching balance:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [address]);

    // Show loading state while account status is being determined
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    // Show connect wallet message if no address
    if (!address) {
        return (
            <div className="flex flex-col items-center justify-center">
                <p>Connect your wallet to view balance</p>
            </div>
        );
    }

    // Show balance once everything is loaded
    return (
        <div className="flex flex-col items-center justify-center">
            <h1>View Balance</h1>
            <p>{balance?.toString() || "NA"}</p>
        </div>
    );
};

export default ViewBalance;